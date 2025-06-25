<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import '../app.css';
	import PreLoadingIndicator from './PreLoadingIndicator.svelte';

	import { navigating } from '$app/state';
	let { children } = $props();

	const session = authClient.useSession();
	let drawerOpen = false;

	function toggleDrawer() {
		drawerOpen = !drawerOpen;
	}
</script>

{#if navigating.to}
	<PreLoadingIndicator />
{/if}

<div class="drawer">
	<input id="mobile-drawer" type="checkbox" class="drawer-toggle" bind:checked={drawerOpen} />
	<div class="drawer-content bg-base-200 min-h-screen">
		<!-- Navigation -->
		<nav class="bg-primary-content text-base-content shadow-lg absolute w-full">
			<div class="container mx-auto px-4">
				<div class="navbar">
					<div class="navbar-start">
						<!-- Logo -->
						<a href="/" class="btn btn-ghost text-xl font-bold normal-case">
							<img
								width="144"
								height="32"
								src="https://raw.githubusercontent.com/ai-rag/ai-rag/main/assets/logo.svg"
								class="mr-2 h-8 w-auto"
								alt="RAG"
							/>
						</a>
					</div>

					<!-- User Menu -->
					<div class="navbar-end">
						{#if $session.data}
							<div class="flex items-center gap-4">
								<!-- User Info -->
								<div class="flex items-center gap-3">
									<div class="avatar online">
										<div
											class="ring-primary ring-offset-base-100 w-10 rounded-full ring ring-offset-2"
										>
											<div
												class="bg-primary-focus text-primary-content flex h-full w-full items-center justify-center rounded-full"
											>
												<span class="text-lg font-bold">
													{$session?.data?.user.name?.charAt(0).toUpperCase() || 'U'}
												</span>
											</div>
										</div>
									</div>
									<span class="hidden font-medium sm:block">
										{$session?.data?.user.name}
									</span>
								</div>

								<!-- Sign Out Button -->
								<button
									class="btn btn-error btn-sm glass"
									onclick={async () => {
										await authClient.signOut();
									}}
								>
									<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
										/>
									</svg>
									Sign Out
								</button>
							</div>
						{:else}
							<button
								class="btn btn-secondary-content glass border-base-300"
								onclick={async () => {
									await authClient.signIn.social({
										provider: 'github'
									});
								}}
							>
								<svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
										clip-rule="evenodd"
									/>
								</svg>
								Continue with GitHub
							</button>
						{/if}
					</div>

					<!-- Mobile Menu Button -->
					<div class="flex-none md:hidden">
						<label
							for="mobile-drawer"
							class="btn btn-circle btn-ghost swap swap-rotate drawer-button"
						>
							<input type="checkbox" bind:checked={drawerOpen} />
							<svg
								class="swap-off fill-current"
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								viewBox="0 0 512 512"
								><path
									d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z"
								/></svg
							>
							<svg
								class="swap-on fill-current"
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								viewBox="0 0 512 512"
								><polygon
									points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"
								/></svg
							>
						</label>
					</div>
				</div>
			</div>
		</nav>

		<!-- Main Content -->
		<div class="w-full h-full">
			{@render children()}
		</div>

		<!-- Footer -->
		<!-- <footer class="footer footer-center bg-base-300 text-base-content mt-auto p-4">
			<aside>
				<p>Copyright © {new Date().getFullYear()} - RAG Platform</p>
			</aside>
		</footer> -->
	</div>

	<div class="drawer-side">
		<label for="mobile-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
		<div class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
			<div class="mb-6 flex justify-center">
				<a href="/" class="btn btn-ghost text-xl normal-case">
					<img
						width="144"
						height="32"
						src="https://raw.githubusercontent.com/ai-rag/ai-rag/main/assets/logo.svg"
						class="h-8 w-auto"
						alt="RAG"
					/>
				</a>
			</div>

			<ul>
				<li>
					<a href="/chat" class="text-lg font-medium" onclick={toggleDrawer}>
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
								d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
							/>
						</svg>
						Chat
					</a>
				</li>
				<li>
					<a href="/dashboard" class="text-lg font-medium" onclick={toggleDrawer}>
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
								d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
							/>
						</svg>
						Dashboard
					</a>
				</li>
				<li>
					<a href="/resources" class="text-lg font-medium" onclick={toggleDrawer}>
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
								d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
							/>
						</svg>
						Resources
					</a>
				</li>
			</ul>

			<div class="divider"></div>

			{#if $session.data}
				<div class="flex items-center gap-2 p-2">
					<div class="avatar online">
						<div class="ring-primary ring-offset-base-100 w-10 rounded-full ring ring-offset-2">
							<div
								class="bg-primary-focus text-primary-content flex h-full w-full items-center justify-center rounded-full"
							>
								<span class="text-lg font-bold"
									>{$session?.data?.user.name?.charAt(0).toUpperCase() || 'U'}</span
								>
							</div>
						</div>
					</div>
					<span class="font-medium">{$session?.data?.user.name}</span>
				</div>
				<div class="mt-4">
					<button
						class="btn btn-error btn-sm w-full"
						onclick={async () => {
							await authClient.signOut();
							toggleDrawer();
						}}
					>
						<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
							/>
						</svg>
						Sign Out
					</button>
				</div>
			{:else}
				<div class="mt-4">
					<button
						class="btn btn-secondary w-full"
						onclick={async () => {
							await authClient.signIn.social({
								provider: 'github'
							});
							toggleDrawer();
						}}
					>
						<svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
								clip-rule="evenodd"
							/>
						</svg>
						Continue with GitHub
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>
