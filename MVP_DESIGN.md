# Pages

## Overall App

- **AI-powered property call center** handles most incoming property communication
  - **Identify User**
    - Check for existing contact info from the incoming medium
    - Some sort of pending user association with the property
    - Identify property
  - **For Maintenance Issues**
    - If emergency, create a task and notify escalation policy (group or property)
    - If not an emergency, see if we can walk the user through the issue
    - If we can't fix it, create a task
      - Collect photos, info, etc.
  - **For General Questions** (Not needed for MVP but useful for handling emergencies)
    - Look up relevant docs:
      - Group docs
      - Property docs
      - User docs

## Jobs

- Shows all jobs and high-level stats
- Issues handled over the past 30 days
- Issues that need attention
  - Clicking this filters for needs-attention jobs
- Live conversations count of jobs currently chatting
- Table of all jobs
- Clicking on an event opens the job page
  - Shows conversation (if live, ability to jump in)
  - Property involved
  - Person calling
  - List of all relevant docs available to open
  - Tasks created
  - History

### Tasks

- Clicking on a task brings up details:
  - Conversation
  - Info for the ticket
  - Any photos
  - Who created it
  - Who was notified
  - Ability to close
  - Eventually sync status from PMS

## AI

- Ability to chat over text or voice as if a user
  - Optionally start a convo with a pre-selected user
  - Optionally start a convo with a pre-selected property
  - Optional ability to create a job
- Ability to chat with PropTuna to ask system-related questions
  - Perform common tasks, get reports, etc. (not needed for MVP)

## Property

- Table with info (Uses [AG Grid](https://www.ag-grid.com/) for table)
  - Rows with groups collapse and show units under them
  - Group rows can also have docs and apply to all sub-units and escalation policies
  - **Address**
  - **Group**
    - Can be created with:
  - **Docs**
    - Plus button next to either select existing or add a new one
    - The plus button should turn into a searchable dropdown; the first item should be "Add New"
    - "Add New" expands to the new doc selection
  - **Escalation Policies**
    - Click "+" in box to select from dropdown or create a new one
      - New one allows selecting from users with a pager-duty-like configuration
      - Specify time to wait before escalating to the next person
      - Similar to new docs, clicking "Add" opens the editor for making a new policy
  - **Clicking on Property**
    - Displays the same table-formatted info
    - Shows history of any associated jobs
  - **Adding a Property**
    - Must specify if single or multi-family
    - All multi-family properties must have a group defined
    - Allow selecting an existing group from dropdown or creating a new one

## People

- Name and contact info
- Similar table to properties, should show:
  - Name
  - Contacts
  - Docs associated with individual users
  - Associations

## Docs

- Shows all defined documents in the system
- **Metadata:**
  - Doc name, where it's associated, last updated
- **Access Scopes**
- **Special Button for Top-Level Doc**
  - Info like the company name
  - Anything the owner wants to share (e.g., operating hours)
  - Should filter for a doc named "Overview"

### Workflow

- **User Calls In**

  - Identify user
  - Lookup from incoming medium (phone number, email)
  - If user is found:
    - Load metadata:
      - Address
      - Available documents and access scopes
      - Recent conversation history
      - User identity and notes
  - If user is not found:
    - Note to LLM that the person is not in the system

- **Ask What the User Wants**

  - **Maintenance Task**

    - Determine if it is an emergency
    - **Emergency Workflow:**
      - If user is unknown, ask for and get an address
      - Attempt to resolve the issue
      - If unresolved, ask if they want to create a ticket or provide more info
      - Create an emergency ticket
      - Inform stakeholders based on escalation policy
      - Set job status to **Needs Attention**
    - **Non-Emergency Workflow:**
      - Gather information about the problem
      - Attempt troubleshooting with the user
        - If resolved, set status to **Green - Helped User**
      - If unresolved:
        - Collect user and address info
        - Verify user and ensure resolution is possible
        - Create a ticket and confirm details with the user
        - Set job status to **Blue - Ticket Created**

  - **General Q&A**
    - If the user is unknown:
      - See if the question can be answered with general documents applicable to all properties
    - If the question is specific:
      - Gather more user information
      - Determine if the question can be answered with general address docs or requires authentication
      - Resolve the address
      - Attempt to answer the question
    - **If the question requires personal details (e.g., lease information):**
      - Go through authentication flow:
        - LLM must use a special tool to retrieve lease info
        - Access code is only available if:
          - The user is calling from a verified medium
          - OR they answer a verification question sent to a configured contact for the address
    - **Post-Answer Workflow:**
      - If successfully answered, set status to **Green - Answered Question**
      - If unanswered:
        - Ask if they want a follow-up
        - If **yes:**
          - Create a follow-up task with a summary
          - Set job status to **Needs Attention**
          - Allow the user to add the question to the knowledge base
        - If **no follow-up requested:**
          - Set job status to **Orange - Unanswered Question**

## API workflow

- a text based user session is started with the first message

  - for new sessions

    - there is an optional createJob parameter when set to false will not create a job
    - in a transaction a chat entity is created and a job entity is created if createJob is true the chat entity has the incomming contacter_id and medium
    - for sms the medium is sms and the contacter_id is the phone number
    - for email the medium is email and the contacter_id is the email address
    - for web the medium is web and the contacter_id is the user_id
      - we need to think throuhg how we make sure somoene doesn't guess contacter_ids
    - the chat message is added to the conversation if it is text or an artifact is creted to persist anything else like a photo or video
      - note eventually we'll need a way to merge chats from other mediums if the user is on the call and texts us a photo we need to be able to link the two
    - an LLM conversation is started sending the first message
    - the response is processed and a chat message is created

      - if the response contains tool use the tool is invoked

        - possible tools
          - resolveAddress(llm parsed text address) -> address_id
            - takes free formed address gatherd from user and sees if we can find the strucured address, returns the address_id, list of potential addresses, or null
            - if we return null or potential addresses the llm should pick one or get more infromation to try again
          - startUserVerification(address_id, contact_info, name) -> status
            - if we cannot identify a user from the phone or email we need to look them up and send them a verification code to we can verify they are who they say they are
          - acceptUserVerificationChallange(address_id, challange_answer) -> user_id, access_token
            - return a specific user id and a temporary access token allowing the llm to fetch private documents
          - getPropertyDocuments(address_id) -> documents
            - returns all the documents for the property with some metadata so the llm knows how to use it. for now add all documents to the context in the future we can give the llm a tool to read it in chunks until it finds an answer
          - getUserDocuments(user_id, access_token) -> documents
            - returns all the documents for the user with some metadata so the llm knows how to use it. for now add all documents to the context in the future we can give the llm a tool to read it in chunks until it finds an answer
          - createEmergencyMaintenanceTask(description, artifact_ids?, contact_info, property_id?, user_id?)
            - creates a new task with the given description and contact info
            - getting the person and property id is optional better to make a task with the contact info then making sure we have the person and property
            - artifacts should be read from the chat db
            - property and user ids should be directly read from the jobs row in the db vs having the llm write it out
          - createMaintenanceTask(description, artifact_ids?, contact_info, property_id, user_id)
            - artifacts should be read from the chat db entry
            - contact info should be passed from the chat db entry
            - property and user ids should be directly read from the jobs row in the db vs having the llm write it out
          - createFollowupTask(description, artifact_ids?, contact_info, property_id?, user_id?)
            - creates a new task with the given description and contact info if the user indicates we were unable to answer their question and states they would like a followup
            - getting the person and property id is optional better to make a task with the contact info then making sure we have the person and property
            - artifacts should be read from the chat db
            - property and user ids should be directly read from the jobs row in the db vs having the llm write it out
          - endConversation() -> status
            - set the chat status to finished if the job does not have a task or all of its tasks are done then also mark the job as finished otherwise set the status to tasks pending

      - the use of the tool is added to the job history and a tool message is
      - added to the message meatadata for the response
        - note we LLM apis expect the same messages as the user session don't use messages to store metadata about non conversations
      - if the tool called is end conversation set the chat status to finished if the job does not have a task or all of its tasks are done then also mark the job as finished otherwise set the status to tasks pending

    - the response is sent to the user

  - for existing sessions (chats where the status is not finished)
    - we look up the chat and job entities
    - check if the chat has the human intervention flag set
      - if set
        - respond 307 with an empty message
          - we'll handle this latter but likely model human overrides as a seprate flow since it should impact very few messages we don't want to engineer normal operations around it... I think
      - if not set
        - proceed as normal
  - the user explicitly leaves a session
    - the chat is marked as finished
    - the job is marked as finished if the user satification flag is set or there are no tasks or all of its tasks are done
  - when a chat is requesed by the api if it is not marked as finished and the last message is over 24 hours old mark the chat as finished then return the chat if the associated job is not marked as finished and it has no tasks mark it as finished add an entry to the job history closed due to age

- a voice based user session is started (note post MVP)
  - for phone calls
  - for web chat

## Build notes

- we want to use open router with gemni for the LLM

## API
