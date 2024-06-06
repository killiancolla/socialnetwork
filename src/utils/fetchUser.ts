export async function fetchUser(userId: string) {
    try {
        const res = await fetch(`/api/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error('Failed to fetch user');
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}
