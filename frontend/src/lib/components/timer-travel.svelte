<script lang="ts">
	import { SessionStatus, type SessionDocument } from "../../db/sessions/define.svelte";

    const { session }: {session: SessionDocument  | null} = $props();

    async function travel(seconds: number) {
       await session?.incrementalUpdate({
            $set: {
                time_end: session.time_end - (seconds * 1000),
                updated_at: new Date().toISOString().replace('T', ' ')
            }
       })
    }
</script>

{#if session && session.status == SessionStatus.Active}
    <div class="flex flex-row gap-2">
        <button class="btn" onclick={async () => await travel(session.time_target * 0.20)}>Advance 20%</button>
        <button class="btn" onclick={async () => await travel(session.time_target - 5)}>Travel to 5 seconds until end</button>
    </div>
{/if}

