export type Notification = {
    id: number;
    type: "message" | "friend" | "system";
    user?: string;
    content: string;
    time: string;
    read: boolean;
};

export const mockNotificationsData: Notification[] = [
    {
        id: 1,
        type: "message",
        user: "Taylor",
        content: "Sent you a message",
        time: "2 min ago",
        read: false
    },
    {
        id: 2,
        type: "friend",
        user: "Jordan",
        content: "Accepted your friend request",
        time: "1 hour ago",
        read: false
    },
    {
        id: 3,
        type: "system",
        content: "Welcome to the new chat experience!",
        time: "2 hours ago",
        read: true
    }
];
