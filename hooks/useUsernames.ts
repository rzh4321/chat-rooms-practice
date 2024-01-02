'use client';
import { useQuery } from "@tanstack/react-query";

const get_usernames = async () => {
    console.log('inside of get_usernames')
    const res = await fetch('/api/usernames');
    const data = await res.json();
    return data.usernames;
}

export default function useUsernames(): {
    usernames: {username: String}[] | undefined;
    isLoading: boolean;
    isError: boolean;
  } {
    const { data: usernames, isLoading, isError } = useQuery<string[]>({
      queryKey: ['/api/usernames'],
      queryFn: get_usernames,
      refetchInterval: 20000, // refresh usernames every 20 secs
    });
  
    return { usernames, isLoading, isError };
  }