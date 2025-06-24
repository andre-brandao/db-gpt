<script lang="ts">
	// import SvelteMarkdown from 'svelte-markdown';
	// import Code from '$lib/client/components/Chat/Code.svelte';
	// import Tool from '$lib/client/components/Chat/Tool.svelte';
	// import Attachment from '$lib/client/components/Chat/Attachment.svelte';
	import sampleDBS from '$lib/samples/data.json';

	import { Chat } from '@ai-sdk/svelte';
	import Message from '$lib/client/components/Chat/Message.svelte';
	import { setContext } from 'svelte';

	// let selectedDb: keyof typeof sampleDBS | undefined = $state('netflix');
	let selectedDb = $state(setContext('db_id', 'netflix' as keyof typeof sampleDBS));
	let selectedInfo = $derived(sampleDBS[selectedDb]);
	const chat = new Chat({
		maxSteps: 5,
		onFinish(message, { usage, finishReason }) {
			console.log('Finished streaming message:', message);
			console.log('Token Usage:', usage);
			console.log('Finish Reason', finishReason);
			// console.log(chat.);
			scrollToBottom();
		},
		onError(err) {
			console.error('An error ocurred', err);
		},
		onResponse(resp) {
			console.log('Received HTTP response:', resp);
		}
	});

	let chatContainer: HTMLDivElement | undefined = $state();

	function scrollToBottom() {
		if (!chatContainer) return;
		chatContainer.scrollTop = chatContainer.scrollHeight;
	}
	$inspect(chat.data).with(console.log);
</script>

<main class="bg-base-200 flex h-[82vh] flex-col p-4 md:p-6">
	<div
		class="bg-base-100 mx-auto flex w-full max-w-4xl flex-1 flex-col overflow-hidden rounded-lg shadow-lg"
	>
		<!-- Chat header -->
		<div class="bg-base-100 flex items-center justify-between rounded-t-lg border-b p-4 shadow-sm">
			<div>
				<h1 class="text-xl font-semibold">DB GPT</h1>
				<p class="text-sm opacity-70">Ask me anything!</p>
				<div class="stats mt-2 shadow">
					<div class="stat">
						<div class="stat-title">Chat ID</div>
						<div class="stat-value">{chat.id?.slice(0, 8)}</div>
						<div class="stat-desc">Status: {chat.status}</div>
					</div>
				</div>
			</div>

			<div class="text-right">
				<select class="select select-bordered" bind:value={selectedDb}>
					{#each Object.keys(sampleDBS) as key (key)}
						<option value={key}>{key}</option>
					{/each}
				</select>
				{#if selectedInfo}
					<div class="form-control w-full max-w-xs">
						<label class="label">
							<span class="label-text">Selected Database</span>
						</label>
						<label class="label">
							{#if selectedInfo}
								<span class="label-text-alt">{selectedInfo.label} ({selectedInfo.type})</span>
							{/if}
						</label>
					</div>
				{:else}
					<p class="mt-2 text-sm text-red-500">No database selected</p>
				{/if}
			</div>
		</div>

		<!-- Chat message area -->
		<div class="flex-1 space-y-4 overflow-y-auto p-4" bind:this={chatContainer}>
			{#if chat.messages.length === 0}
				<div class="flex h-full items-center justify-center">
					<div class="text-center opacity-70">
						<p class="mb-2">No messages yet</p>
						<p class="text-sm">Type something below to start the conversation</p>
					</div>
				</div>
			{:else}
				{#each chat.messages as message (message.id)}
					<Message {...message} />
				{/each}

				{#if chat.error}
					<div role="alert" class="alert alert-error">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 shrink-0 stroke-current"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>{chat.error.name} - {chat.error.message}</span>
						<button class="btn btn-error btn-ghost" onclick={() => chat.reload({})}>Retry</button>
					</div>
				{/if}
			{/if}
		</div>

		<!-- Input area -->
		<div class="bg-base-100 rounded-b-lg border-t p-4">
			<form
				onsubmit={(e) =>
					chat.handleSubmit(e, {
						body: {
							db_id: selectedDb
						}
					})}
				class="flex space-x-2"
			>
				<input
					bind:value={chat.input}
					disabled={chat.status !== 'ready'}
					placeholder="Type your message here..."
					class="input input-bordered focus:ring-primary flex-1 rounded-full focus:border-transparent focus:ring-2 focus:outline-none"
				/>
				{#if chat.status === 'streaming' || chat.status === 'submitted'}
					<button
						class="btn btn-primary btn-circle text-primary-content flex items-center justify-center"
						onclick={chat.stop}
						aria-label="Stop Chat"
					>
						{#if chat.status === 'submitted'}
							<span class="loading loading-spinner loading-sm"></span>
						{:else}
							Stop
						{/if}
					</button>
				{:else}
					<button
						type="submit"
						aria-label="Send Message"
						class="btn btn-primary btn-circle text-primary-content flex items-center justify-center"
						disabled={!chat.input}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
							/>
						</svg>
					</button>
				{/if}
			</form>
		</div>
	</div>
</main>

<style>
	/* Hide scrollbar for Chrome, Safari and Opera */
	.overflow-y-auto::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	.overflow-y-auto {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>
