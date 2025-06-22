<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Page Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
		</div>

		<!-- Dashboard Grid -->
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
			<!-- CLI Usage Card -->
			<a
				href="/dashboard/cli"
				class="group relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md"
			>
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 transition-colors group-hover:bg-blue-200"
						>
							<svg
								class="h-6 w-6 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
								/>
							</svg>
						</div>
					</div>
					<div class="ml-4 flex-1">
						<h3
							class="text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600"
						>
							Uso da CLI
						</h3>
						<p class="mt-1 text-sm text-gray-500">Command line interface tools and utilities</p>
					</div>
				</div>
				<div class="mt-4">
					<div class="flex items-center text-sm text-blue-600 group-hover:text-blue-700">
						<span>Access CLI tools</span>
						<svg
							class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</div>
				</div>
			</a>

			<!-- Resources Card -->
			<a
				href="/resources"
				class="group relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-green-300 hover:shadow-md"
			>
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 transition-colors group-hover:bg-green-200"
						>
							<svg
								class="h-6 w-6 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
								/>
							</svg>
						</div>
					</div>
					<div class="ml-4 flex-1">
						<h3
							class="text-lg font-semibold text-gray-900 transition-colors group-hover:text-green-600"
						>
							Recursos Disponíveis
						</h3>
						<p class="mt-1 text-sm text-gray-500">Manage and view all available resources</p>
					</div>
				</div>
				<div class="mt-4">
					<div class="flex items-center text-sm text-green-600 group-hover:text-green-700">
						<span>View resources</span>
						<svg
							class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</div>
				</div>
			</a>

			<!-- Users Card -->
			<a
				href="/dashboard/users"
				class="group relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-purple-300 hover:shadow-md"
			>
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 transition-colors group-hover:bg-purple-200"
						>
							<svg
								class="h-6 w-6 text-purple-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
								/>
							</svg>
						</div>
					</div>
					<div class="ml-4 flex-1">
						<h3
							class="text-lg font-semibold text-gray-900 transition-colors group-hover:text-purple-600"
						>
							Usuários
						</h3>
						<p class="mt-1 text-sm text-gray-500">User management and administration</p>
					</div>
				</div>
				<div class="mt-4">
					<div class="flex items-center text-sm text-purple-600 group-hover:text-purple-700">
						<span>Manage users</span>
						<svg
							class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</div>
				</div>
			</a>

			<!-- Chat Card -->
			<a
				href="/chat"
				class="group relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-orange-300 hover:shadow-md"
			>
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 transition-colors group-hover:bg-orange-200"
						>
							<svg
								class="h-6 w-6 text-orange-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
								/>
							</svg>
						</div>
					</div>
					<div class="ml-4 flex-1">
						<h3
							class="text-lg font-semibold text-gray-900 transition-colors group-hover:text-orange-600"
						>
							Chat
						</h3>
						<p class="mt-1 text-sm text-gray-500">Interactive chat and communication tools</p>
					</div>
				</div>
				<div class="mt-4">
					<div class="flex items-center text-sm text-orange-600 group-hover:text-orange-700">
						<span>Start chatting</span>
						<svg
							class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</div>
				</div>
			</a>
		</div>

		<!-- Additional Info Section -->
		<div class="mt-12 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<div class="text-center">
				<h2 class="text-lg font-semibold text-gray-900">Quick Start</h2>
			</div>
		</div>
	</div>
</div>
