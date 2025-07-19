import { CallApiWithAuth } from "@/config/axios.config";

export async function fetchGetMessages(
    conversationId: number,
    page: number,
    offset: number
) {
    const response = await CallApiWithAuth.get(
        `/chat/get-messages/${conversationId}?page=${page}&offset=${offset}`
    );
    return response.data.data;
}
