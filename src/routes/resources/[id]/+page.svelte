<script lang="ts">
	import { enhance } from '$app/forms';
	import SvelteMarkdown from 'svelte-markdown';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	// enhance
</script>

<div class="bg-base-200 min-h-screen py-8">
	<div class="container mx-auto max-w-4xl px-4">
		<!-- Page Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold">Resource Management</h1>
			<p class="mt-2 text-gray-600">Manage your resource status and embeddings</p>
		</div>

		<!-- Alert Messages -->
		{#if form?.message && form?.success}
			<div class="alert alert-success mb-6">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 shrink-0 stroke-current"
					fill="none"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					/></svg
				>
				<span>{form.message}</span>
			</div>
		{/if}

		{#if form?.message && !form?.success}
			<div class="alert alert-error mb-6">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 shrink-0 stroke-current"
					fill="none"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
					/></svg
				>
				<span>{form.message}</span>
			</div>
		{/if}

		<div class="grid gap-6 lg:grid-cols-3">
			<!-- Resource Overview - Takes up 2 columns -->
			<div class="space-y-6 lg:col-span-2">
				<!-- Resource Details -->
				<div class="card bg-base-100 shadow-sm">
					<div class="card-title border-b p-6">
						<h2 class="text-lg">Resource Details</h2>
					</div>
					<div class="card-body">
						<div class="grid gap-4 md:grid-cols-3">
							<div>
								<dt class="text-sm font-medium opacity-70">ID</dt>
								<dd class="mt-1 font-mono text-sm">{data.resource.id}</dd>
							</div>
							<div>
								<dt class="text-sm font-medium opacity-70">Created By</dt>
								<dd class="mt-1 text-sm">{data.resource.createdBy}</dd>
							</div>
							<div>
								<dt class="text-sm font-medium opacity-70">Source</dt>
								<dd class="mt-1 text-sm">{data.resource.source}</dd>
							</div>
							<div>
								<dt class="text-sm font-medium opacity-70">Status</dt>
								<dd class="mt-1">
									<span
										class="badge
										{data.resource.status === 'published'
											? 'badge-success'
											: data.resource.status === 'draft'
												? 'badge-warning'
												: data.resource.status === 'archived'
													? 'badge-ghost'
													: data.resource.status === 'deleted'
														? 'badge-error'
														: 'badge-info'}"
									>
										{data.resource.status}
									</span>
								</dd>
							</div>
						</div>
					</div>
				</div>

				<!-- Resource Content -->
				<div class="card bg-base-100 shadow-sm">
					<div class="card-title border-b p-6">
						<h2 class="text-lg">Resource Content</h2>
					</div>
					<div class="card-body">
						<div
							class="border-base-300 bg-base-200 max-h-96 min-h-32 overflow-y-auto rounded-md border p-4 text-sm break-words whitespace-pre-line"
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
				<div class="card bg-base-100 shadow-sm">
					<div class="card-title border-b p-6">
						<h3 class="text-lg">Update Status</h3>
					</div>
					<div class="card-body">
						<form method="POST" action="?/update" class="space-y-4" use:enhance>
							<div>
								<label for="status" class="block text-sm font-medium">Status</label>
								<select
									id="status"
									name="status"
									class="select select-bordered mt-1 w-full"
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
							<button type="submit" class="btn btn-primary w-full"> Update Status </button>
						</form>
					</div>
				</div>

				<!-- Embeddings Control -->
				<div class="card bg-base-100 shadow-sm">
					<div class="card-title border-b p-6">
						<h3 class="text-lg">Embeddings</h3>
					</div>
					<div class="card-body">
						<form method="POST" action="?/embed" class="space-y-4" use:enhance>
							<div class="text-sm opacity-70">
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
								class="btn w-full
									{data.embeddings.length > 0 ? 'btn-disabled' : 'btn-success'}"
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
			<div class="card bg-base-100 mt-8 shadow-sm">
				<div class="card-title flex-col items-start border-b p-6">
					<h3 class="text-lg">Generated Embeddings</h3>
					<p class="mt-1 text-sm opacity-70">
						{data.embeddings.length} embedding{data.embeddings.length !== 1 ? 's' : ''} found
					</p>
				</div>
				<div class="divide-base-200 divide-y">
					{#each data.embeddings as e, index (e.id)}
						<div class="p-6">
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<div class="flex items-center space-x-2">
										<h4 class="text-sm font-medium">Embedding #{index + 1}</h4>
										<span class="badge badge-info">
											ID: {e.id}
										</span>
									</div>
									<div class="mt-3">
										<p class="text-sm opacity-70">Content:</p>
										<div
											class="border-base-300 bg-base-200 mt-1 max-h-32 overflow-y-auto rounded-md border p-3 text-sm"
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
