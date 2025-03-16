"use client"

import React, { useState } from "react";
import { StatsCard } from "(components)/stats-card";
import { JobsTable } from "(components)/jobs-table";
import { JobDetail } from "(components)/job-detail";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [taskType, setTaskType] = useState("all");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showNeedsAttention, setShowNeedsAttention] = useState(false);

  // Mock data with expanded job details
  const jobsData = [
    {
      id: "1",
      state: "task created",
      overview: "Broken dishwasher",
      date: "2023-06-15",
      property: {
        address: "123 Main St",
        unit: "4B",
        city: "San Francisco",
        state: "CA",
        zip: "94105",
        type: "Apartment",
        owner: "Vista Ridge Properties",
        manager: "John Manager",
        image:
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXBhcnRtZW50JTIwYnVpbGRpbmd8ZW58MHx8MHx8fDA%3D",
      },
      person: {
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "(555) 123-4567",
        avatar: "https://github.com/yusufhilmi.png",
      },
      conversation: [
        {
          sender: "user",
          message:
            "My dishwasher isn't working properly. It's not draining water after the cycle.",
          timestamp: "2023-06-15 10:23 AM",
        },
        {
          sender: "agent",
          message:
            "I'm sorry to hear that. Can you tell me when you first noticed the issue?",
          timestamp: "2023-06-15 10:24 AM",
          avatar: "https://github.com/polymet-ai.png",
        },
        {
          sender: "user",
          message:
            "It started yesterday evening. I ran a cycle and found standing water at the bottom.",
          timestamp: "2023-06-15 10:26 AM",
        },
        {
          sender: "agent",
          message:
            "Thank you for the information. I'll create a maintenance task for this issue. A technician will contact you soon.",
          timestamp: "2023-06-15 10:28 AM",
          avatar: "https://github.com/polymet-ai.png",
        },
      ],

      tasks: [
        {
          id: "task-1",
          description: "Repair dishwasher that's not draining properly",
          status: "open",
          created: "2023-06-15 10:30 AM",
          createdBy: "AI Assistant",
          notified: ["Maintenance Team", "Property Manager"],
          photos: [
            "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGlzaHdhc2hlcnxlbnwwfHwwfHx8MA%3D%3D",
            "https://images.unsplash.com/photo-1581622558663-b2e33377dfb2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGlzaHdhc2hlcnxlbnwwfHwwfHx8MA%3D%3D",
          ],
        },
      ],

      documents: [
        { title: "Maintenance Policy", type: "markdown" },
        { title: "Emergency Contact List", type: "markdown" },
        { title: "Tenant Agreement", type: "markdown" },
        { title: "Appliance Manuals", type: "markdown" },
        { title: "Escalation Policy", type: "markdown" },
      ],
    },
    {
      id: "2",
      state: "chat ended",
      overview: "Answered question about light bulb",
      date: "2023-06-14",
      property: {
        address: "456 Oak Avenue",
        unit: "2C",
        city: "San Francisco",
        state: "CA",
        zip: "94107",
        type: "Apartment",
        owner: "Vista Ridge Properties",
        manager: "John Manager",
      },
      person: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "(555) 987-6543",
        avatar: "https://github.com/furkanksl.png",
      },
      conversation: [
        {
          sender: "user",
          message:
            "Hi, I need to replace a light bulb in my bathroom but I'm not sure what type to get.",
          timestamp: "2023-06-14 3:15 PM",
        },
        {
          sender: "agent",
          message:
            "Hello Jane, I'd be happy to help you with that. The bathroom fixtures use LED bulbs with an E26 base, 60W equivalent (around 9W actual).",
          timestamp: "2023-06-14 3:16 PM",
          avatar: "https://github.com/polymet-ai.png",
        },
        {
          sender: "user",
          message:
            "Great, thank you! Do I need to provide these myself or does maintenance handle this?",
          timestamp: "2023-06-14 3:18 PM",
        },
        {
          sender: "agent",
          message:
            "According to your lease agreement, standard light bulbs are the tenant's responsibility. However, if you have any difficulty accessing the fixture, maintenance can assist you.",
          timestamp: "2023-06-14 3:20 PM",
          avatar: "https://github.com/polymet-ai.png",
        },
        {
          sender: "user",
          message: "That's clear, thanks for the information!",
          timestamp: "2023-06-14 3:21 PM",
        },
      ],

      documents: [
        { title: "Tenant Handbook", type: "markdown" },
        { title: "Maintenance Responsibilities", type: "markdown" },
      ],
    },
    {
      id: "3",
      state: "Attention needed!",
      overview: "Flood at 315, contacts notified",
      date: "2023-06-13",
      property: {
        address: "935 Woodmoor Drive",
        unit: "315",
        city: "San Francisco",
        state: "CA",
        zip: "94110",
        type: "Apartment",
        owner: "Woodmoor Properties LLC",
        manager: "Sarah Manager",
        image:
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXBhcnRtZW50JTIwYnVpbGRpbmd8ZW58MHx8MHx8fDA%3D",
      },
      person: {
        name: "Robert Johnson",
        email: "robert.johnson@example.com",
        phone: "(555) 555-1234",
        avatar: "https://github.com/yusufhilmi.png",
      },
      isLive: true,
      needsAttention: true,
      suggestedAction:
        "Emergency plumber has assessed the situation. Recommend immediate approval of $750 repair cost to fix the burst pipe and prevent further water damage.",
      conversation: [
        {
          sender: "user",
          message:
            "EMERGENCY! There's water coming from the ceiling in my bathroom! It looks like a pipe burst upstairs.",
          timestamp: "2023-06-13 8:45 PM",
        },
        {
          sender: "agent",
          message:
            "This is an emergency situation. I'm notifying the emergency maintenance team right away. Can you turn off the main water valve if you can safely access it?",
          timestamp: "2023-06-13 8:46 PM",
          avatar: "https://github.com/polymet-ai.png",
        },
        {
          sender: "user",
          message:
            "I don't know where the main valve is. The water is coming down fast!",
          timestamp: "2023-06-13 8:47 PM",
        },
        {
          sender: "agent",
          message:
            "I understand. Emergency maintenance has been dispatched and should arrive within 30 minutes. Please move your belongings away from the water if possible and avoid using electrical outlets in the affected area.",
          timestamp: "2023-06-13 8:48 PM",
          avatar: "https://github.com/polymet-ai.png",
        },
        {
          sender: "user",
          message: "Ok, I'll try to contain the water. Please hurry!",
          timestamp: "2023-06-13 8:49 PM",
        },
        {
          sender: "system",
          message:
            "Escalation policy activated. Notified: Emergency Maintenance, Property Manager, Regional Manager",
          timestamp: "2023-06-13 8:50 PM",
          avatar: "https://github.com/polymet-ai.png",
        },
      ],

      tasks: [
        {
          id: "task-2",
          description: "Emergency - Water leak from ceiling in unit 315",
          status: "open",
          created: "2023-06-13 8:50 PM",
          createdBy: "AI Assistant",
          notified: [
            "Emergency Maintenance",
            "Property Manager",
            "Regional Manager",
          ],

          photos: [
            "https://images.unsplash.com/photo-1594122230689-45899d9e6f69?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2F0ZXIlMjBsZWFrfGVufDB8fDB8fHww",
            "https://images.unsplash.com/photo-1603969072881-b0fc7f3d77d7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2F0ZXIlMjBsZWFrfGVufDB8fDB8fHww",
          ],
        },
      ],

      documents: [
        { title: "Emergency Procedures", type: "markdown" },
        { title: "Insurance Policy", type: "markdown" },
        { title: "Building Plumbing Plan", type: "markdown" },
      ],
    },
  ];

  const filteredJobs = showNeedsAttention
    ? jobsData.filter((job) => job.state === "Attention needed!")
    : jobsData;

  const handleJobClick = (job: any) => {
    setSelectedJob(job);
  };

  const handleCloseJobDetail = () => {
    setSelectedJob(null);
  };

  const handleNeedsAttentionClick = () => {
    setShowNeedsAttention(true);
  };

  return (
    <div className="space-y-6">
      <h1
        className="text-2xl font-bold text-gray-900 dark:text-white"
      >
        Jobs Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Issues handled 30 days" value={20} />
        <div
          onClick={handleNeedsAttentionClick}
          className="cursor-pointer"
        >
          <StatsCard title="needs attention" value={1} />
        </div>
        <StatsCard title="live conversations" value={10} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-48">
          <Select value={taskType} onValueChange={setTaskType}>
            <SelectTrigger>
              <SelectValue placeholder="Task type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                All tasks
              </SelectItem>
              <SelectItem value="maintenance">
                Maintenance
              </SelectItem>
              <SelectItem value="emergency">
                Emergency
              </SelectItem>
              <SelectItem value="inquiry">
                Inquiry
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <JobsTable jobs={filteredJobs} onJobClick={handleJobClick} />

      {selectedJob && (
        <JobDetail
          job={selectedJob}
          onClose={handleCloseJobDetail}
        />
      )}
    </div>
  );
}
