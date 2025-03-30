<script lang="ts">
	import SvelteMarkdown from '@humanspeak/svelte-markdown';
	import Code from '$lib/Code.svelte';
	import { Chat } from '@ai-sdk/svelte';
	
	const chat = new Chat();
	
	// For auto-scrolling to bottom of chat
	let chatContainer: HTMLDivElement | undefined = $state();
	
	function scrollToBottom() {
	  if (!chatContainer) return;
	  chatContainer.scrollTop = chatContainer.scrollHeight;
	}
	
	// // Auto-scroll when new messages arrive
	// $effect(() => {
	//   if (chat.messages.length > 0) {
	// 	setTimeout(scrollToBottom, 100);
	//   }
	// });
  </script>
  
  <main class="flex flex-col h-screen bg-base-200 p-4 md:p-6">
	<div class="flex-1 overflow-hidden flex flex-col bg-base-100 rounded-lg shadow-lg max-w-4xl mx-auto w-full">
	  <!-- Chat header -->
	  <div class="border-b p-4 bg-base-100 rounded-t-lg shadow-sm">
		<h1 class="text-xl font-semibold">Chatbot Assistant</h1>
		<p class="text-sm opacity-70">Ask me anything!</p>
	  </div>
	  
	  <!-- Chat message area -->
	  <div class="flex-1 overflow-y-auto p-4 space-y-4" bind:this={chatContainer}>
		{#if chat.messages.length === 0}
		  <div class="flex items-center justify-center h-full">
			<div class="text-center opacity-70">
			  <p class="mb-2">No messages yet</p>
			  <p class="text-sm">Type something below to start the conversation</p>
			</div>
		  </div>
		{:else}
		  {#each chat.messages as message}
			<div class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}">
			  <div class="max-w-3/4 {message.role === 'user' 
				? 'bg-primary text-primary-content rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
				: 'bg-base-200 text-base-content rounded-tl-lg rounded-tr-lg rounded-br-lg'} p-3 shadow-sm">
				
				{#if message.role === 'assistant'}
				  <div class="prose prose-sm max-w-none">
					<SvelteMarkdown
					  source={message.content}
					  renderers={{
						code: Code
					  }}
					/>
				  </div>
				{:else}
				  <p class="whitespace-pre-wrap break-words">{message.content}</p>
				{/if}
			  </div>
			</div>
		  {/each}
		{/if}
	  </div>
	  
	  <!-- Input area -->
	  <div class="border-t p-4 bg-base-100 rounded-b-lg">
		<form onsubmit={chat.handleSubmit} class="flex space-x-2">
		  <input 
			bind:value={chat.input} 
			placeholder="Type your message here..." 
			class="input input-bordered flex-1 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
		  />
		  <button 
			type="submit" 
			class="btn btn-primary btn-circle text-primary-content flex items-center justify-center"
			disabled={!chat.input || chat.status === "streaming"}
		  >
			{#if chat.status === 'streaming'}
			  <span class="loading loading-spinner loading-sm"></span>
			{:else}
			  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
			  </svg>
			{/if}
		  </button>
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
	  -ms-overflow-style: none;  /* IE and Edge */
	  scrollbar-width: none;  /* Firefox */
	}
  </style>