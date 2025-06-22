import { auth } from "$lib/auth"; // path to your auth file
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { svelteKitHandler } from "better-auth/svelte-kit";
 
// export async function handle({ event, resolve }) {
//     return svelteKitHandler({ event, resolve, auth });
// }
 const authHandler:Handle = async ({ event, resolve }) =>  svelteKitHandler({
        event,
        resolve,
        auth,
        
    });
const handleUser: Handle = async ({ event, resolve }) => {
	const { request } = event;

	console.log(`${request.method}: ${new URL(request.url).pathname}`);

	try {
		const session = await auth.api.getSession({
			headers: request.headers
		});



		event.locals.session = session;

        console.log('Session:', session?.user.id);

	} catch (error) {
        console.error("Error getting session:", error);
    }
    return resolve(event);
};

const handleLog: Handle = async ({ event, resolve }) => {
    const { request } = event;
    console.log(`${request.method}: ${new URL(request.url).pathname}`);
    return resolve(event);
};

export const handle = sequence(handleLog,authHandler, handleUser);