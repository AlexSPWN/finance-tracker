const apiUrl = import.meta.env.VITE_FINTRACK_API;

// store token in a memory
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
    accessToken = token;
}

let refreshPromise: Promise<string | null> | null = null; // deduplicate refresh calls

export const apiFetch = async <T>(input: RequestInfo, init?: RequestInit, retry = true): Promise<T | null> => {
    
    const res = await fetch(`${apiUrl}${input}`, {
        ...init,
        credentials: "include", //connect Cookie refreshToken
        headers: {
            ...(init?.headers || {}),
            ...(accessToken 
                ? {Authorization: `Bearer ${accessToken}`}
                : {}
            )
        }
    });

    //If Unauthorized
    if(res.status === 401 && retry) {
        
        if(!refreshPromise) {
            refreshPromise = (async () => {                
                //In case the browser or tab was closed
                const refreshRes = await fetch(`${apiUrl}/auth/refresh`, {
                    method: "POST",
                    credentials: "include"
                });
            
                if(!refreshRes.ok) return null;
                const data = await refreshRes.json();
                setAccessToken(data.accessToken);
                return data.accessToken;  
            })();
            // Reset refreshPromise after it resolves
            refreshPromise.finally(() => (refreshPromise = null));
        }

        const newToken = await refreshPromise;

        if(!newToken) {
            throw new Error("Unauthorized");
        }

        //repeat the original request
        return apiFetch<T>(input, init, false);
        /* res = await fetch(`${apiUrl}${input}`, {
            ...init,
            credentials: "include",
            headers: {
                ...(init?.headers || {}),
                ...(accessToken 
                    ? {Authorization: `Bearer ${accessToken}`}
                    : {}
                )
            }
        }); */
    }

    const bodyText = await res.text();

    let data = null;
    if(bodyText) {
        try {
            data = JSON.parse(bodyText);
        } catch {
            data = bodyText;
        }
    } 

    if(!res.ok) {
        const errMessage =  data?.message || data?.error || 
            (typeof data === "string" ? data : null) || "Request failed";
        throw new Error(errMessage);
    }

    return data as T | null;
}