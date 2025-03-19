"use client"

import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  FileTextIcon,
  FileIcon,
  ShieldIcon,
  EyeIcon,
  EyeOffIcon,
  BuildingIcon,
  UserIcon,
  HomeIcon,
  MoreHorizontalIcon,
  DownloadIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";

interface Document {
  id: string;
  title: string;
  type: string;
  summary: string;
  isPublic: boolean;
  lastUpdated: string;
  associations: Array<{
    type: string;
    name: string;
  }>;
}

interface DocumentsTableProps {
  documents: Document[];
}

export function DocumentsTable({ documents }: DocumentsTableProps) {
  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case "markdown":
        return (
          <FileTextIcon
            className="h-4 w-4 text-blue-600 dark:text-blue-400"
          />
        );

      case "file":
        return (
          <FileIcon
            className="h-4 w-4 text-green-600 dark:text-green-400"
          />
        );

      case "escalation-policy":
        return (
          <ShieldIcon
            className="h-4 w-4 text-purple-600 dark:text-purple-400"
          />
        );

      default:
        return <FileTextIcon className="h-4 w-4" />;
    }
  };

  const getDocumentTypeBadge = (type: string) => {
    switch (type) {
      case "markdown":
        return (
          <Badge
            className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
          >
            Markdown
          </Badge>
        );

      case "file":
        return (
          <Badge
            className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          >
            File
          </Badge>
        );

      case "escalation-policy":
        return (
          <Badge
            className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
          >
            Escalation Policy
          </Badge>
        );

      default:
        return (
          <Badge variant="outline">
            {type}
          </Badge>
        );
    }
  };

  const getAssociationIcon = (type: string) => {
    switch (type) {
      case "group":
        return <BuildingIcon className="h-3 w-3 mr-1" />;
      case "property":
        return <HomeIcon className="h-3 w-3 mr-1" />;
      case "user":
        return <UserIcon className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">
              Document
            </TableHead>
            <TableHead>Associations</TableHead>
            <TableHead className="w-[300px]">
              Summary
            </TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document, index) => (
            <TableRow
              key={document.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
              id={`58pdwa_${index}`}
            >
              <TableCell className="font-medium" id={`gmnnuz_${index}`}>
                <div
                  className="flex items-center space-x-2"
                  id={`dy5tnt_${index}`}
                >
                  {getDocumentTypeIcon(document.type)}
                  <span id={`zt329y_${index}`}>{document.title}</span>
                </div>
                <div className="mt-1" id={`llz6x9_${index}`}>
                  {getDocumentTypeBadge(document.type)}
                </div>
              </TableCell>
              <TableCell id={`s2mm4l_${index}`}>
                <div className="flex flex-wrap gap-1" id={`0iwlb2_${index}`}>
                  {document.associations.map((assoc, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="flex items-center text-xs bg-gray-100 dark:bg-gray-700"
                      id={`vb0k7l_${index}`}
                    >
                      {getAssociationIcon(assoc.type)}
                      {assoc.name}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell id={`yriqey_${index}`}>
                <p
                  className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2"
                  id={`h08me3_${index}`}
                >
                  {document.summary}
                </p>
              </TableCell>
              <TableCell id={`1y8xdv_${index}`}>
                {document.isPublic ? (
                  <div
                    className="flex items-center text-green-600 dark:text-green-400"
                    id={`1r2ivw_${index}`}
                  >
                    <EyeIcon className="h-4 w-4 mr-1" id={`qd8ta7_${index}`} />
                    <span id={`0vyk97_${index}`}>Public</span>
                  </div>
                ) : (
                  <div
                    className="flex items-center text-amber-600 dark:text-amber-400"
                    id={`rtuk4h_${index}`}
                  >
                    <EyeOffIcon
                      className="h-4 w-4 mr-1"
                      id={`7nw0gt_${index}`}
                    />
                    <span id={`08k6av_${index}`}>Private</span>
                  </div>
                )}
              </TableCell>
              <TableCell id={`iiyn23_${index}`}>
                {formatDate(document.lastUpdated)}
              </TableCell>
              <TableCell id={`y0r0qr_${index}`}>
                <DropdownMenu id={`i05g0d_${index}`}>
                  <DropdownMenuTrigger asChild id={`3hk97x_${index}`}>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      id={`ow3tan_${index}`}
                    >
                      <MoreHorizontalIcon
                        className="h-4 w-4"
                        id={`wyr35u_${index}`}
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" id={`1k554m_${index}`}>
                    <DropdownMenuItem id={`8n2j2l_${index}`}>
                      <EyeIcon
                        className="mr-2 h-4 w-4"
                        id={`c97iei_${index}`}
                      />
                      <span id={`vvxhva_${index}`}>View</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem id={`4aegts_${index}`}>
                      <DownloadIcon
                        className="mr-2 h-4 w-4"
                        id={`rxnm8o_${index}`}
                      />
                      <span id={`4xvq0e_${index}`}>Download</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem id={`0y0wpo_${index}`}>
                      <PencilIcon
                        className="mr-2 h-4 w-4"
                        id={`q2uza5_${index}`}
                      />
                      <span id={`4vk85a_${index}`}>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 dark:text-red-400"
                      id={`tlw9wp_${index}`}
                    >
                      <TrashIcon
                        className="mr-2 h-4 w-4"
                        id={`dyycap_${index}`}
                      />
                      <span id={`1qsvjq_${index}`}>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
