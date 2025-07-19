"use client";

import React, { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  X,
  Users,
  Search,
  Check,
  AlertCircle,
  Loader2,
  Lock,
  Globe,
  UserPlus,
  ImageIcon,
  Camera,
  Settings,
  Info,
  ChevronRight,
  Sparkles
} from "lucide-react";
import type { User } from "@/types/chat";

interface GroupCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (groupData: GroupCreationData) => Promise<void>;
  availableUsers: User[];
  currentUser: User;
}

export interface GroupCreationData {
  name: string;
  description: string;
  avatar: string;
  participants: User[];
}

// Zod schema for group creation
const groupSchema = z.object({
  name: z
    .string()
    .min(2, "Group name must be at least 2 characters long")
    .max(50, "Group name must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9\s\-_.,!?()]+$/,
      "Group name contains invalid characters"
    ),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),
  participants: z
    .array(
      z.object({
        id: z.number().int(),
        name: z.string(),
        avatar: z.string().optional(),
        status: z.string(),
        role: z.string().optional()
      })
    )
    .min(1, "Please select at least one participant")
    .max(100, "Groups can have a maximum of 100 participants"),
  avatar: z.string().default("")
});

type GroupFormValues = z.infer<typeof groupSchema>;

export default function GroupCreationModal({
  isOpen,
  onClose,
  onCreateGroup,
  availableUsers,
  currentUser
}: GroupCreationModalProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // react-hook-form setup
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isValid }
  } = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      participants: [],
      avatar: undefined
    }
  });

  // Watch fields for UI
  const groupName = watch("name");
  const groupDescription = watch("description");
  const selectedParticipants = watch("participants");

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      reset({
        name: "",
        description: "",
        participants: [],
        avatar: undefined
      });
      setSearchQuery("");
      setIsCreating(false);
    }
  }, [isOpen, reset]);

  // Filter available users
  const filteredUsers = availableUsers.filter(
    (user) =>
      user.id !== currentUser.id &&
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle participant selection
  const toggleParticipant = (user: User) => {
    const isSelected = selectedParticipants.some((p) => p.id == user.id);
    if (isSelected) {
      setValue(
        "participants",
        selectedParticipants.filter((p) => p.id !== user.id),
        { shouldValidate: true }
      );
    } else {
      setValue("participants", [...selectedParticipants, user], {
        shouldValidate: true
      });
    }
  };

  // Handle group creation
  const onSubmit = async (data: GroupFormValues) => {
    setIsCreating(true);
    try {
      currentUser.role = "admin";
      await onCreateGroup({
        ...data,
        description: data.description || "",
        participants: [...(data.participants as User[]), currentUser],
        avatar: data.avatar || ""
      });
      onClose();
    } catch (error) {
      setIsCreating(false);
      return;
    }
    setIsCreating(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#1e1f2e]/80 backdrop-blur-md rounded-xl border border-indigo-500/20 overflow-hidden shadow-[0_0_15px_rgba(79,70,229,0.15)] max-h-[90vh] w-[450px] mx-auto"
        >
          {/* Header */}
          <div className="p-3 border-b border-white/10 flex gap-3 items-center justify-center">
            <Users className="w-6 h-6 text-indigo-500" />
            <h1 className="text-lg font-medium text-white">Create New Group</h1>
          </div>

          {/* Scrollable Content */}
          <ScrollArea className="h-[calc(85vh-200px)]" ref={scrollRef}>
            <div className="p-6 space-y-8">
              {/* Group Details Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`relative p-6 rounded-2xl border transition-all duration-300 ${"border-white/10 bg-black/20 hover:border-white/20"}`}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <Info className="h-4 w-4 text-indigo-500" />
                  <h3 className="text-lg font-semibold text-white">
                    Group Details
                  </h3>
                </div>

                {/* Avatar Section */}
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-white mb-3">
                    Group Avatar
                  </label>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative group cursor-pointer">
                      <div className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                        <Users className="h-12 w-12 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <Camera className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm"
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                  </div>
                </div>

                {/* Name and Description */}
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Group Name <span className="text-red-400">*</span>
                    </label>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Enter a memorable group name..."
                          className="bg-[#1a1b26] border-white/10 text-white focus:border-indigo-500 focus:ring-indigo-500/20"
                          maxLength={50}
                        />
                      )}
                    />
                    <div className="flex justify-between items-center mt-2">
                      {errors.name && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center text-red-400 text-sm"
                        >
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.name.message}
                        </motion.div>
                      )}
                      <div className="text-xs text-gray-500 ml-auto">
                        <span
                          className={
                            groupName.length > 40 ? "text-orange-400" : ""
                          }
                        >
                          {groupName.length}
                        </span>
                        /50
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Description
                    </label>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          placeholder="What's this group about? (Optional)"
                          className="bg-[#1a1b26] border-white/10 text-white focus:border-indigo-500 focus:ring-indigo-500/20 "
                          rows={3}
                          maxLength={200}
                        />
                      )}
                    />
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      <span
                        className={
                          (groupDescription?.length ?? 0) > 180
                            ? "text-orange-400"
                            : ""
                        }
                      >
                        {groupDescription?.length || 0}
                      </span>
                      /200
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Participants Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`relative p-6 rounded-2xl border transition-all duration-300 ${"border-white/10 bg-black/20 hover:border-white/20"}`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <UserPlus className="h-4 w-4 text-indigo-500" />
                    <h3 className="text-lg font-semibold text-white">
                      Add Participants
                    </h3>
                    <span className="text-red-400 text-sm">*</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border-indigo-500/30"
                  >
                    {selectedParticipants.length} selected
                  </Badge>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search contacts by name..."
                    className="pl-10 bg-[#1a1b26] border-white/10 text-white focus:border-indigo-500 focus:ring-indigo-500/20"
                  />
                </div>

                {/* Selected Participants */}
                {selectedParticipants.length > 0 && (
                  <div className="mb-6">
                    <div className="text-sm text-gray-300 mb-3 flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-400" />
                      Selected participants:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedParticipants.map((user) => (
                        <motion.div
                          key={user.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-full pl-1 pr-3 py-1"
                        >
                          <Avatar className="h-6 w-6 mr-2">
                            <img
                              src={user.avatar || "/placeholder.svg"}
                              alt={user.name}
                            />
                          </Avatar>
                          <span className="text-sm text-white font-medium">
                            {user.name}
                          </span>
                          <button
                            onClick={() =>
                              toggleParticipant({
                                ...user,
                                avatar: user.avatar || "/placeholder.svg",
                                status: user.status as
                                  | "online"
                                  | "offline"
                                  | "away",
                                role: "member"
                              })
                            }
                            className="ml-2 hover:bg-red-500/30 rounded-full p-1 transition-colors"
                          >
                            <X className="h-3 w-3 text-gray-300 hover:text-white" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Available Users */}
                <div className="border border-white/10 rounded-xl bg-black/30 backdrop-blur-sm">
                  <ScrollArea className="h-64">
                    <div className="p-4">
                      {filteredUsers.length > 0 ? (
                        <div className="space-y-2">
                          {filteredUsers.map((user) => {
                            const isSelected = selectedParticipants.some(
                              (p) => p.id === user.id
                            );
                            return (
                              <motion.div
                                key={user.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => toggleParticipant(user)}
                                className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                                  isSelected
                                    ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30"
                                    : "hover:bg-white/5 border border-transparent"
                                }`}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  aria-readonly
                                  className="pointer-events-none"
                                />
                                <Avatar className="h-10 w-10 ring-2 ring-white/10">
                                  <img
                                    src={user.avatar || "/placeholder.svg"}
                                    alt={user.name}
                                  />
                                </Avatar>
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-white">
                                    {user.name}
                                  </div>
                                  <div className="text-xs text-gray-400 flex items-center">
                                    <div
                                      className={`w-2 h-2 rounded-full mr-2 ${
                                        user.status === "online"
                                          ? "bg-green-500"
                                          : user.status === "away"
                                          ? "bg-yellow-500"
                                          : "bg-gray-500"
                                      }`}
                                    />
                                    {user.status}
                                  </div>
                                </div>
                                {isSelected && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center"
                                  >
                                    <Check className="h-3 w-3 text-white" />
                                  </motion.div>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-400">
                          <UserPlus className="h-12 w-12 mx-auto mb-3 opacity-30" />
                          <p className="text-lg font-medium mb-1">
                            No contacts found
                          </p>
                          <p className="text-sm">
                            Try adjusting your search terms
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                {errors.participants && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center text-red-400 text-sm mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {errors.participants.message}
                  </motion.div>
                )}
              </motion.section>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 bg-[#1a1b26]/50">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex items-center justify-between space-x-4"
            >
              <div className="text-sm text-gray-400">
                {selectedParticipants.length > 0 && (
                  <span className="text-indigo-300">
                    Ready to create group with {selectedParticipants.length + 1}{" "}
                    members
                  </span>
                )}
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  type="button"
                  onClick={onClose}
                  disabled={isCreating}
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating || !isValid}
                  className={`relative overflow-hidden transition-all duration-300 ${
                    isValid
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Group...
                    </>
                  ) : (
                    <>
                      <Users className="h-4 w-4 mr-2" />
                      Create Group
                    </>
                  )}
                  {isValid && !isCreating && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 3
                      }}
                    />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
