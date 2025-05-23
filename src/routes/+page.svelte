<script lang="ts">
    import { shortcut } from "@svelte-put/shortcut";
    import ChartLine from "lucide-svelte/icons/chart-line";
    import Pause from "lucide-svelte/icons/pause";
    import Play from "lucide-svelte/icons/play";
    import Settings from "lucide-svelte/icons/settings";
    import SkipForward from "lucide-svelte/icons/skip-forward";
    import Volume from "lucide-svelte/icons/volume";
    import Volume1 from "lucide-svelte/icons/volume-1";
    import Volume2 from "lucide-svelte/icons/volume-2";
    import VolumeX from "lucide-svelte/icons/volume-x";
    import { onMount } from "svelte";
    import { sound } from "svelte-sound";
    import KairosLogo from "../kairos-logo.svelte";
    import {
        get_instellingen,
        restore_instellingen,
        set_korte_pauze_tijd,
        set_lange_pauze_tijd,
        set_pomo_tijd,
        set_tick_geluid,
        set_tick_geluid_volume,
        set_ui_geluiden,
        set_ui_geluiden_volume,
    } from "../state/instellingen.svelte";
    import { PomoType, Sessie, SessieStatus } from "../state/sessie.svelte";
    import "../style.css";

    let sessie = $state<Sessie>();
    let studietijd_vandaag = $state<number>(0);
    let studietijd_gisteren = $state<number>(0);
    let verschil_vandaag_gisteren = $derived(
        studietijd_vandaag - studietijd_gisteren,
    );

    onMount(() => {
        restore_instellingen();
        studietijd_vandaag = Sessie.sommeer_studietijd(new Date());
        studietijd_gisteren = Sessie.sommeer_studietijd(
            new Date(new Date().setDate(new Date().getDate() - 1)),
        );

        const lokale_sessie = Sessie.restore_lokaal();

        if (lokale_sessie) {
            sessie = lokale_sessie;
            if (sessie.status == SessieStatus.Actief) {
                sessie.timer.start(() => {
                    sessie.status = SessieStatus.Voltooid;
                    sessie.sla_lokaal_op();
                });
            }
        } else {
            sessie = new Sessie(PomoType.Pomo, get_instellingen().pomo_tijd);
        }
    });

    const click_geluid_url = new URL("/click.mp3", import.meta.url);

    let instellingen_modal: HTMLDialogElement;
    let statistieken_modal: HTMLDialogElement;
    let start_knop = $state<HTMLButtonElement>();
</script>

<svelte:window
    on:beforeunload={(e) =>
        sessie?.status == SessieStatus.Actief ? e.preventDefault() : false}
    use:shortcut={{
        trigger: {
            key: " ",
            modifier: false,
            callback: () => start_knop.click(),
        },
    }}
/>

<dialog bind:this={statistieken_modal} id="statistieken" class="modal">
    <div class="modal-box">
        <h3 class="text-lg font-bold">Statistieken</h3>

        <div class="stats shadow">
            <div class="stat">
                <div class="stat-title">Studietijd (vandaag)</div>
                <div class="stat-value">
                    {new Date(studietijd_vandaag * 1000)
                        .toISOString()
                        .substring(11, 16)}
                </div>
                <div
                    class={`stat-desc ${verschil_vandaag_gisteren > 0 ? "text-success" : "text-error"}`}
                >
                    {Math.abs(verschil_vandaag_gisteren) > 3600
                        ? `${Math.floor(Math.abs(verschil_vandaag_gisteren) / 3600)} uren ${Math.floor(
                              (Math.abs(verschil_vandaag_gisteren) % 3600) / 60,
                          )} minuten`
                        : `${Math.floor(Math.abs(verschil_vandaag_gisteren) / 60)} minuten`}
                    {verschil_vandaag_gisteren > 0
                        ? `meer dan gisteren`
                        : `minder dan gisteren`}
                </div>
            </div>
        </div>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>

<dialog bind:this={instellingen_modal} id="instellingen" class="modal">
    <div class="modal-box">
        <h3 class="text-lg font-bold">Instellingen</h3>
        <fieldset
            class="fieldset bg-base-100 border-base-300 rounded-box w-full border p-4"
        >
            <legend class="fieldset-legend">Focustijden</legend>
            <div class="flex flex-row gap-2">
                <div class="flex flex-col">
                    <label for="pomo" class="label">Pomodoro</label>
                    <input
                        id="pomo"
                        type="number"
                        class="input"
                        placeholder="25"
                        value={get_instellingen().pomo_tijd / 60}
                        onchange={(e) => {
                            set_pomo_tijd(
                                parseInt((e.target as HTMLInputElement).value) *
                                    60,
                            );
                            sessie = new Sessie(
                                PomoType.Pomo,
                                parseInt((e.target as HTMLInputElement).value) *
                                    60,
                            );
                        }}
                    />
                </div>
                <div class="flex flex-col">
                    <label for="korte_pauze" class="label">Korte pauze</label>
                    <input
                        id="korte_pauze"
                        type="number"
                        class="input"
                        placeholder="5"
                        value={get_instellingen().korte_pauze_tijd / 60}
                        onchange={(e) => {
                            set_korte_pauze_tijd(
                                parseInt((e.target as HTMLInputElement).value) *
                                    60,
                            );
                            sessie = new Sessie(
                                PomoType.KortePauze,
                                parseInt((e.target as HTMLInputElement).value) *
                                    60,
                            );
                        }}
                    />
                </div>
                <div class="flex flex-col">
                    <label for="lange_pauze" class="label">Lange pauze</label>
                    <input
                        id="lange_pauze"
                        type="number"
                        class="input"
                        placeholder="15"
                        value={get_instellingen().lange_pauze_tijd / 60}
                        onchange={(e) => {
                            set_lange_pauze_tijd(
                                parseInt((e.target as HTMLInputElement).value) *
                                    60,
                            );
                            sessie = new Sessie(
                                PomoType.LangePauze,
                                parseInt((e.target as HTMLInputElement).value) *
                                    60,
                            );
                        }}
                    />
                </div>
            </div>
        </fieldset>
        <fieldset
            class="fieldset bg-base-100 border-base-300 rounded-box w-full border p-4"
        >
            <legend class="fieldset-legend">Geluid</legend>
            <div class="flex flex-row justify-evenly items-center">
                <label class="label">
                    <input
                        type="checkbox"
                        checked={get_instellingen().ui_geluiden}
                        onchange={(e) =>
                            set_ui_geluiden(
                                (e.target as HTMLInputElement).checked,
                            )}
                        class="toggle"
                    />
                    UI-geluiden
                </label>
                <button class="btn btn-primary btn-circle">
                    {#if get_instellingen().ui_geluiden && get_instellingen().ui_geluiden_volume < 25}
                        <Volume class="size-[1.2em]" />
                    {:else if get_instellingen().ui_geluiden && get_instellingen().ui_geluiden_volume >= 25 && get_instellingen().ui_geluiden_volume < 75}
                        <Volume1 class="size-[1.2em]" />
                    {:else if get_instellingen().ui_geluiden && get_instellingen().ui_geluiden_volume >= 75}
                        <Volume2 class="size-[1.2em]" />
                    {:else}
                        <VolumeX class="size-[1.2em]" />
                    {/if}
                </button>

                <input
                    disabled={!get_instellingen().ui_geluiden}
                    type="range"
                    min="0"
                    max="100"
                    onchange={(e) =>
                        set_ui_geluiden_volume(
                            parseInt((e.target as HTMLInputElement).value),
                        )}
                    value={get_instellingen().ui_geluiden_volume}
                    class="range w-[30%]"
                />
            </div>
            <div class="divider"></div>
            <div class="flex flex-row justify-evenly items-center">
                <label class="label">
                    <input
                        type="checkbox"
                        checked={get_instellingen().tick_geluid}
                        onchange={(e) =>
                            set_tick_geluid(
                                (e.target as HTMLInputElement).checked,
                            )}
                        class="toggle"
                    />
                    Tick-geluid
                </label>
                <button class="btn btn-primary btn-circle">
                    {#if get_instellingen().tick_geluid && get_instellingen().tick_geluid_volume < 25}
                        <Volume class="size-[1.2em]" />
                    {:else if get_instellingen().tick_geluid && get_instellingen().tick_geluid_volume >= 25 && get_instellingen().tick_geluid_volume < 75}
                        <Volume1 class="size-[1.2em]" />
                    {:else if get_instellingen().tick_geluid && get_instellingen().tick_geluid_volume >= 75}
                        <Volume2 class="size-[1.2em]" />
                    {:else}
                        <VolumeX class="size-[1.2em]" />
                    {/if}
                </button>
                <input
                    disabled={!get_instellingen().tick_geluid}
                    type="range"
                    min="0"
                    max="100"
                    value={get_instellingen().tick_geluid_volume}
                    onchange={(e) =>
                        set_tick_geluid_volume(
                            parseInt((e.target as HTMLInputElement).value),
                        )}
                    class="range w-[30%]"
                />
            </div>
        </fieldset>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>

<header class="h-[10vh] flex flex-row justify-around items-center">
    <div class="flex flex-row gap-2 items-center">
        <KairosLogo /><span class="text-4xl text-primary font-bold">Kairos</span>
    </div>
    <button
        class="btn btn-ghost"
        onclick={() => statistieken_modal.showModal()}
    >
        <ChartLine class="size-[1.2em]" />
        Statistieken
    </button>
    <button
        class="btn btn-primary"
        onclick={() => instellingen_modal.showModal()}
    >
        <Settings class="size-[1.2em]" />
        Instellingen
    </button>
</header>
<main
    class="h-[90vh] w-[100vw] flex flex-col justify-around items-center py-10"
>
    <section class="w-full flex flex-row gap-2 justify-center rounded">
        <button
            disabled={sessie?.status == SessieStatus.Actief}
            class={[
                "btn",
                {
                    "btn-primary disabled:bg-primary":
                        sessie?.pomo_type == PomoType.Pomo,
                },
                { "btn-neutral": sessie?.pomo_type != PomoType.Pomo },
                {
                    "disabled:!bg-primary disabled:text-neutral":
                        sessie?.pomo_type == PomoType.Pomo,
                },
            ]}
            onclick={() => {
                if (sessie?.status != SessieStatus.Actief) {
                    sessie = new Sessie(
                        PomoType.Pomo,
                        get_instellingen().pomo_tijd,
                    );
                }
            }}
        >
            Pomodoro
        </button>
        <button
            disabled={sessie?.status == SessieStatus.Actief}
            class={[
                "btn",
                { "btn-primary": sessie?.pomo_type == PomoType.KortePauze },
                { "btn-neutral": sessie?.pomo_type != PomoType.KortePauze },
                {
                    "disabled:!bg-primary disabled:text-neutral":
                        sessie?.pomo_type == PomoType.KortePauze,
                },
            ]}
            onclick={() => {
                if (sessie?.status != SessieStatus.Actief) {
                    sessie = new Sessie(
                        PomoType.KortePauze,
                        get_instellingen().korte_pauze_tijd,
                    );
                }
            }}
        >
            Pauze
        </button>
        <button
            disabled={sessie?.status == SessieStatus.Actief}
            class={[
                "btn",
                { "btn-primary": sessie?.pomo_type == PomoType.LangePauze },
                { "btn-neutral": sessie?.pomo_type != PomoType.LangePauze },
                {
                    "disabled:!bg-primary disabled:text-neutral":
                        sessie?.pomo_type == PomoType.LangePauze,
                },
            ]}
            onclick={() => {
                if (sessie?.status != SessieStatus.Actief) {
                    sessie = new Sessie(
                        PomoType.LangePauze,
                        get_instellingen().lange_pauze_tijd,
                    );
                }
            }}
        >
            Lange pauze
        </button>
    </section>
    <section>
        <span class="countdown font-mono text-8xl rounded w-full">
            {#if sessie}
                <span
                    style={`--value:${sessie.get_minuten()};`}
                    aria-live="polite"
                    aria-label={sessie.get_minuten()}
                    >{sessie.get_minuten()}</span
                >
                :
                <span
                    style={`--value:${sessie.get_seconden()};`}
                    aria-live="polite"
                    aria-label={sessie.get_seconden()}
                    >{sessie.get_seconden()}</span
                >
            {/if}
        </span>
    </section>
    <section class="flex flex-row gap-2 justify-center">
        {#if sessie}
            {#if sessie.status == SessieStatus.Actief}
                <button
                    bind:this={start_knop}
                    class="btn btn-primary btn-wide"
                    onclick={() => sessie?.pauzeer()}
                >
                    <Pause class="size-[1.2em]" />
                    Pauzeer
                </button>
                <button
                    class="btn btn-secondary"
                    onclick={() => sessie?.sla_over()}
                    ><SkipForward class="size-[1.2em]" />Sla over</button
                >
            {:else if sessie.status == SessieStatus.Gepauzeerd}
                <button
                    bind:this={start_knop}
                    use:sound={{ src: click_geluid_url, events: ["click"] }}
                    class="btn btn-primary btn-wide"
                    onclick={() => sessie?.hervat()}
                >
                    <Play class="size-[1.2em]" />
                    Hervat</button
                >
                <button
                    class="btn btn-secondary"
                    onclick={() => sessie?.sla_over()}
                    ><SkipForward class="size-[1.2em]" /> Sla over</button
                >
            {:else}
                <button
                    bind:this={start_knop}
                    use:sound={{ src: click_geluid_url, events: ["click"] }}
                    class="btn btn-primary btn-wide"
                    onclick={() => sessie?.start()}
                    ><Play class="size-[1.2em]" />Start</button
                >
            {/if}
        {/if}
    </section>
</main>
