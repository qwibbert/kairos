<script lang="ts">
	import i18next from "i18next";
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
        <button class="btn" onclick={async () => await travel(session.time_target * 0.20)}>{i18next.t("session:advance_20%")}</button>
        <button class="btn" onclick={async () => await travel(session.time_target - 5)}>{i18next.t("travel_5_seconds_until_end")}</button>
    </div>
{/if}

