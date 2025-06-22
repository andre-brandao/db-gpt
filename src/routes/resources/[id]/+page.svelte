<script lang="ts">
	import { enhance } from '$app/forms';
	import SvelteMarkdown from 'svelte-markdown';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	// enhance
</script>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="mx-auto max-w-4xl px-4">
		<!-- Page Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Resource Management</h1>
			<p class="mt-2 text-gray-600">Manage your resource status and embeddings</p>
		</div>

		<!-- Alert Messages -->
		{#if form?.message && form?.success}
			<div class="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
				<div class="flex items-center">
					<svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd"
						/>
					</svg>
					<p class="ml-3 text-sm font-medium text-green-800">{form.message}</p>
				</div>
			</div>
		{/if}

		{#if form?.message && !form?.success}
			<div class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
				<div class="flex items-center">
					<svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
							clip-rule="evenodd"
						/>
					</svg>
					<p class="ml-3 text-sm font-medium text-red-800">{form.message}</p>
				</div>
			</div>
		{/if}

		<div class="grid gap-6 lg:grid-cols-3">
			<!-- Resource Overview - Takes up 2 columns -->
			<div class="space-y-6 lg:col-span-2">
				<!-- Resource Details -->
				<div class="rounded-lg border border-gray-200 bg-white shadow-sm">
					<div class="border-b border-gray-200 px-6 py-4">
						<h2 class="text-lg font-semibold text-gray-900">Resource Details</h2>
					</div>
					<div class="p-6">
						<div class="grid gap-4 md:grid-cols-3">
							<div>
								<dt class="text-sm font-medium text-gray-500">ID</dt>
								<dd class="mt-1 font-mono text-sm text-gray-900">{data.resource.id}</dd>
							</div>
							<div>
								<dt class="text-sm font-medium text-gray-500">Created By</dt>
								<dd class="mt-1 text-sm text-gray-900">{data.resource.createdBy}</dd>
							</div>
							<div>
								<dt class="text-sm font-medium text-gray-500">Source</dt>
								<dd class="mt-1 text-sm text-gray-900">{data.resource.source}</dd>
							</div>
							<div>
								<dt class="text-sm font-medium text-gray-500">Status</dt>
								<dd class="mt-1">
									<span
										class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
										{data.resource.status === 'published'
											? 'bg-green-100 text-green-800'
											: data.resource.status === 'draft'
												? 'bg-yellow-100 text-yellow-800'
												: data.resource.status === 'archived'
													? 'bg-gray-100 text-gray-800'
													: data.resource.status === 'deleted'
														? 'bg-red-100 text-red-800'
														: 'bg-blue-100 text-blue-800'}"
									>
										{data.resource.status}
									</span>
								</dd>
							</div>
						</div>
					</div>
				</div>

				<!-- Resource Content -->
				<div class="rounded-lg border border-gray-200 bg-white shadow-sm">
					<div class="border-b border-gray-200 px-6 py-4">
						<h2 class="text-lg font-semibold text-gray-900">Resource Content</h2>
					</div>
					<div class="p-6">
						<div
							class="max-h-96 min-h-32 overflow-y-auto rounded-md border border-gray-200 bg-gray-50 p-4 text-sm break-words whitespace-pre-line text-gray-900"
						>
							<!-- {data.resource.content} -->
							<SvelteMarkdown source={data.resource.content} />
						</div>
					</div>
				</div>
			</div>

			<!-- Actions Panel - Takes up 1 column -->
			<div class="space-y-6">
				<!-- Update Status -->
				<div class="rounded-lg border border-gray-200 bg-white shadow-sm">
					<div class="border-b border-gray-200 px-6 py-4">
						<h3 class="text-lg font-semibold text-gray-900">Update Status</h3>
					</div>
					<div class="p-6">
						<form method="POST" action="?/update" class="space-y-4" use:enhance>
							<div>
								<label for="status" class="block text-sm font-medium text-gray-700">Status</label>
								<select
									id="status"
									name="status"
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
									value={data.resource.status}
								>
									<option value="draft">Draft</option>
									<option value="published">Published</option>
									<option value="archived">Archived</option>
									<option value="deleted">Deleted</option>
									<option value="pending_review">Pending Review</option>
									<option value="pending_embedding">Pending Embeddings</option>
								</select>
							</div>
							<input type="hidden" name="id" value={data.resource.id} />
							<button
								type="submit"
								class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
							>
								Update Status
							</button>
						</form>
					</div>
				</div>

				<!-- Embeddings Control -->
				<div class="rounded-lg border border-gray-200 bg-white shadow-sm">
					<div class="border-b border-gray-200 px-6 py-4">
						<h3 class="text-lg font-semibold text-gray-900">Embeddings</h3>
					</div>
					<div class="p-6">
						<form method="POST" action="?/embed" class="space-y-4" use:enhance>
							<div class="text-sm text-gray-600">
								{#if data.embeddings.length > 0}
									<p>
										Current embeddings: <span class="font-medium">{data.embeddings.length}</span>
									</p>
								{:else}
									<p>No embeddings generated yet.</p>
								{/if}
							</div>
							<button
								type="submit"
								class="w-full rounded-md px-4 py-2 text-sm font-medium transition-colors
									{data.embeddings.length > 0
									? 'cursor-not-allowed bg-gray-100 text-gray-400'
									: 'bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none'}"
							>
								{data.embeddings.length > 0 ? 'Embeddings Generated' : 'Generate Embeddings'}
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>

		<!-- Embeddings List -->
		{#if data.embeddings?.length}
			<div class="mt-8 rounded-lg border border-gray-200 bg-white shadow-sm">
				<div class="border-b border-gray-200 px-6 py-4">
					<h3 class="text-lg font-semibold text-gray-900">Generated Embeddings</h3>
					<p class="mt-1 text-sm text-gray-600">
						{data.embeddings.length} embedding{data.embeddings.length !== 1 ? 's' : ''} found
					</p>
				</div>
				<div class="divide-y divide-gray-200">
					{#each data.embeddings as e, index (e.id)}
						<div class="p-6">
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<div class="flex items-center space-x-2">
										<h4 class="text-sm font-medium text-gray-900">Embedding #{index + 1}</h4>
										<span
											class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
										>
											ID: {e.id}
										</span>
									</div>
									<div class="mt-3">
										<p class="text-sm text-gray-600">Content:</p>
										<div
											class="mt-1 max-h-32 overflow-y-auto rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900"
										>
											{e.content}
										</div>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
