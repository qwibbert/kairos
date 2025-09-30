import { goto } from "$app/navigation";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import i18next from "i18next";
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
                  const settings_modal = document.getElementById('settings-modal');
                  settings_modal?.show();
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
                  const settings_modal: HTMLDialogElement | null = document.getElementById('settings-modal');
                  settings_modal?.close();
                }

                driverObj.moveNext();
              },
              onPrevClick: async () => {
                if (mobile) {
                  await goto('/');
                } else {
                  const settings_modal: HTMLDialogElement | null = document.getElementById('settings-modal');
                  settings_modal?.close();
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
                  const stats_modal = document.getElementById('stats');
                  stats_modal?.show();
                }

                driverObj.moveNext();
              },
              onPrevClick: async () => {
                if (mobile) {
                  await goto('settings');
                } else {
                  const settings_modal: HTMLDialogElement = document.getElementById('settings-modal');
                  settings_modal.show();
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
                  const stats_modal: HTMLDialogElement = document.getElementById('stats');
                  stats_modal.close();
                }

                driverObj.moveNext();
              },
              onPrevClick: async () => {
                if (mobile) {
                  await goto('/');
                } else {
                  const stats_modal: HTMLDialogElement = document.getElementById('stats');
                  stats_modal.close();
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
                  const vines_modal: HTMLDialogElement = document.getElementById('vines');
                  vines_modal.show();
                }

                driverObj.moveNext();
              },
              onPrevClick: async () => {
                if (mobile) {
                  await goto('/statistics');
                } else {
                  const stats_modal: HTMLDialogElement = document.getElementById('stats');
                  stats_modal.show();
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
                  const vines_modal: HTMLDialogElement = document.getElementById('vines');
                  vines_modal.close();
                }

                driverObj.moveNext();
              },
              onPrevClick: async () => {
                if (mobile) {
                  await goto('/');
                } else {
                  const vines_modal: HTMLDialogElement = document.getElementById('vines');
                  vines_modal.close();
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
                  const vines_modal: HTMLDialogElement = document.getElementById('vines');
                vines_modal.show();
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
