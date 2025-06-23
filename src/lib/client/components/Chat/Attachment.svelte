<script lang="ts">
	import type { Attachment } from 'ai';

	type Props = {
		attachment: Attachment;
	};

	let { attachment }: Props = $props();
</script>

s

{#if attachment.contentType?.startsWith('image/')}
	<img src={attachment.url} width={500} height={500} alt={attachment.name ?? `attachment-${i}`} />
{:else if attachment.contentType?.startsWith('application/pdf')}
	<iframe src={attachment.url} width={500} height={600} title={attachment.name ?? `attachment-${i}`}
	></iframe>
{/if}
