import { goto } from "$app/navigation";
import SettingsModal from "$features/settings/components/settings-modal.svelte";
import StatsModal from "$features/stats/components/stats-modal.svelte";
import VineModal from "$features/vines/components/vine-modal.svelte";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import i18next from "i18next";
import { modals } from "svelte-modals";
import { db } from "../../db/db";


i18next.on('initialized', async () => {
  let mobile = window.matchMedia("(width <= 40rem)").matches;
  if (db) {
    if (!await db.settings.get_setting('tour_completed')) {
      await goto('/');
      const driverObj = driver({
        nextBtnText: i18next.t('common:next'),
        prevBtnText: i18next.t('common:previous'),
        doneBtnText: i18next.t('common:close'),
        showProgress: true,
        allowClose: false,
        onDestroyed: async () => {
          await db.settings.get_settings().then((settings) => settings?.modify_setting('tour_completed', true));
        },
        steps: [
          {
            popover: {
              onPopoverRender: (popover, { config, state }) => {
                const skip_button = document.createElement("button");
                skip_button.innerText = i18next.t('common:skip');
                popover.footerButtons.appendChild(skip_button);

                skip_button.addEventListener("click", () => {
                  driverObj.destroy();
                });

              }, title: i18next.t('onboarding:title_1'), description: i18next.t('onboarding:text_1')
            }
          },
          { element: '#tour-1', popover: { title: i18next.t('onboarding:title_2'), description: i18next.t('onboarding:text_2') } },
          {
            element: mobile ? '#tour-2-mobile' : '#tour-2', popover: {
              title: i18next.t('onboarding:title_3'), description: i18next.t('onboarding:text_3'), onNextClick: () => {
                if (mobile) {
                  const settings_button = document.getElementById('tour-2-mobile');
                  settings_button?.click();
                } else {
                  modals.open(SettingsModal, { non_modal: true });
                }
                driverObj.moveNext();
              }
            }
          },
          {
            popover: {
              title: i18next.t('onboarding:title_4'), description: i18next.t('onboarding:text_4'), onNextClick: async () => {
                if (mobile) {
                  await goto('/');
                } else {
                  modals.closeAll();
                }

                driverObj.moveNext();
              },
              onPrevClick: async () => {
                if (mobile) {
                  await goto('/');
                } else {
                  modals.closeAll();
                }

                driverObj.movePrevious();
              }
            }
          },
          {
            element: mobile ? '#tour-3-mobile' : '#tour-3', popover: {
              title: i18next.t('onboarding:title_5'), description: i18next.t('onboarding:text_5'), onNextClick: async () => {
                if (mobile) {
                  await goto('/statistics');
                } else {
                  modals.open(StatsModal, { non_modal: true });
                }

                driverObj.moveNext();
              },
              onPrevClick: async () => {
                if (mobile) {
                  await goto('settings');
                } else {
                  modals.open(StatsModal, { non_modal: true });
                }

                driverObj.movePrevious();
              }
            }
          },
          {
            popover: {
              title: i18next.t('onboarding:title_6'), description: i18next.t('onboarding:text_6'), onNextClick: async () => {
                if (mobile) {
                  await goto('/');
                } else {
                  modals.closeAll();
                }

                driverObj.moveNext();
              },
              onPrevClick: async () => {
                if (mobile) {
                  await goto('/');
                } else {
                  modals.closeAll();
                }

                driverObj.movePrevious();
              }
            }
          },
          {
            element: mobile ? '#tour-4-mobile' : '#tour-4', popover: {
              title: i18next.t('onboarding:title_7'), description: i18next.t('onboarding:text_7'), onNextClick: async () => {
                if (mobile) {
                  await goto('/vines')
                } else {
                  modals.open(VineModal, { non_modal: true });
                }

                driverObj.moveNext();
              },
              onPrevClick: async () => {
                if (mobile) {
                  await goto('/statistics');
                } else {
                  modals.open(StatsModal, {non_modal: true});
                }

                driverObj.movePrevious();
              }
            }
          },
          {
            element: mobile ? '#tour-5-fab' : '#tour-5-box', popover: {
              title: i18next.t('onboarding:title_8'), description: i18next.t('onboarding:text_7'),
              onNextClick: async () => {
                if (mobile) {
                  await goto('/');
                } else {
                  modals.closeAll();
                }

                driverObj.moveNext();
              },
              onPrevClick: async () => {
                if (mobile) {
                  await goto('/');
                } else {
                  modals.closeAll();
                }

                driverObj.movePrevious();
              }
            },
          },
          {
            popover: {
              title: i18next.t('onboarding:title_9'), description: i18next.t('onboarding:text_9'), onPrevClick: async () => {
                if (mobile) {
                  await goto('/vines');
                } else {
                  modals.closeAll();
                }
                

                driverObj.movePrevious();
              }
            }
          }
        ]
      });

      driverObj.drive();
    }
  }
})
