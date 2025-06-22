<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import '../app.css';
	import PreLoadingIndicator from './PreLoadingIndicator.svelte';

	import { navigating } from '$app/state';
	let { children } = $props();

	const session = authClient.useSession();
</script>

{#if navigating.to}
	<PreLoadingIndicator />
{/if}

<div class="min-h-screen bg-gray-50">
	<!-- Navigation -->
	<nav class="border-b border-gray-200 bg-white shadow-sm">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<!-- Logo -->
				<div class="flex-shrink-0">
					<a href="/" class="flex items-center">
						<img
							width="144"
							height="32"
							src="https://raw.githubusercontent.com/ai-rag/ai-rag/main/assets/logo.svg"
							class="h-8 w-auto"
							alt="RAG"
						/>
					</a>
				</div>

				<!-- Navigation Links -->
				<div class="hidden md:block">
					<div class="ml-10 flex items-baseline space-x-4">
						<a
							href="/chat"
							class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
						>
							Chat
						</a>
						<a
							href="/dashboard"
							class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
						>
							Dashboard
						</a>
						<a
							href="/resources"
							class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
						>
							Resources
						</a>
					</div>
				</div>

				<!-- User Menu -->
				<div class="flex items-center space-x-4">
					{#if $session.data}
						<div class="flex items-center space-x-4">
							<!-- User Info -->
							<div class="flex items-center space-x-3">
								<div class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
									<span class="text-sm font-medium text-gray-700">
										{$session?.data?.user.name?.charAt(0).toUpperCase() || 'U'}
									</span>
								</div>
								<span class="hidden sm:block text-sm font-medium text-gray-700">
									{$session?.data?.user.name}
								</span>
							</div>

							<!-- Sign Out Button -->
							<button
								class="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
								onclick={async () => {
									await authClient.signOut();
								}}
							>
								<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
								</svg>
								Sign Out
							</button>
						</div>
					{:else}
						<button
							class="inline-flex items-center rounded-md border border-transparent bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
							onclick={async () => {
								await authClient.signIn.social({
									provider: 'github'
								});
							}}
						>
							<svg class="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd" />
							</svg>
							Continue with GitHub
						</button>
					{/if}
				</div>

				<!-- Mobile Menu Button -->
				<div class="md:hidden">
					<button
						class="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
						onclick={() => {
							// Toggle mobile menu - you'll need to implement this state
						}}
					>
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>
				</div>
			</div>
		</div>
		<!-- <div class="md:hidden">
			<div class="space-y-1 px-2 pb-3 pt-2 sm:px-3">
				<a href="/chat" class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">Chat</a>
				<a href="/tools" class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">Tools</a>
				<a href="/resources" class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">Resources</a>
			</div>
		</div> -->
	</nav>

	<!-- Main Content -->
	<main>
		{@render children()}
	</main>
</div>
