export interface UserInfo {
    user_id: number;
    user_account?: string;
    user_name: string;
    user_nickname: string;
    user_avatar: string;
    user_states?: number;
    user_mobile?: string;
    user_gender: number;
    user_birthday?: string;
    user_email?: string;
    user_status?: "online" | "offline" | "away";
    user_is_authentication?: number;
    created_at?: string;
    updated_at?: string;
    mutualFriends?: number; // Optional field for mutual friends count
}

export interface SearchUserResponse {
    user_id: number;
    user_nickname: string;
    user_avatar: string;
    user_states: string;
    user_gender: number;
}