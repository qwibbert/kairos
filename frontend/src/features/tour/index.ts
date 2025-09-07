import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { db } from "../../db/db";

if (db) {
  if (!await db.settings.get_setting('tour_completed')) {
    const driverObj = driver({
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
              skip_button.innerText = "Sla over";
              popover.footerButtons.appendChild(skip_button);

              skip_button.addEventListener("click", () => {
                driverObj.destroy();
              });

            }, title: 'Hallo daar!', description: 'Kairos is een applicatie waarmee je studietijd beter kan indelen en bijhouden aan de hand van de Pomodoro techniek.'
          }
        },
        { element: '#tour-1', popover: { title: 'Timer', description: 'In dit gedeelte kan je de timer bedienen. Na elke Pomodoro sessie volgt er een korte pauze. Na 4 sessies krijg je een langere pauze!' } },
        {
          element: '#tour-2', popover: {
            title: 'Instellingen', description: 'Hier kan je de instellingen aanpassen.', onNextClick: () => {
              const settings_modal: HTMLDialogElement = document.getElementById('settings');
              settings_modal.show();
              driverObj.moveNext();
            }
          }
        },
        {
          element: '#settings', popover: {
            title: 'Instellingen', description: 'Neem maar eens een kijkje naar de vele thema\'s!', onNextClick: () => {
              const settings_modal: HTMLDialogElement = document.getElementById('settings');
              settings_modal.close();
              driverObj.moveNext();
            },
            onPrevClick: () => {
              const settings_modal: HTMLDialogElement = document.getElementById('settings');
              settings_modal.close();
              driverObj.movePrevious();
            }
          }
        },
        {
          element: '#tour-3', popover: {
            title: 'Statistieken', description: 'Iedereen houdt stiekem wel van wat statistieken, hier kan je ze bekijken.', onNextClick: () => {
              const stats_modal: HTMLDialogElement = document.getElementById('stats');
              stats_modal.show();
              driverObj.moveNext();
            },
            onPrevClick: () => {
              const settings_modal: HTMLDialogElement = document.getElementById('settings');
              settings_modal.show();
              driverObj.movePrevious();
            }
          }
        },
        {
          element: '#stats', popover: {
            title: 'Statistieken', description: 'Momenteel ziet het er wat leegjes uit! Tijd om daar verandering in te brengen :)', onNextClick: () => {
              const stats_modal: HTMLDialogElement = document.getElementById('stats');
              stats_modal.close();
              driverObj.moveNext();
            },
            onPrevClick: () => {
              const stats_modal: HTMLDialogElement = document.getElementById('stats');
              stats_modal.close();
              driverObj.movePrevious();
            }
          }
        },
        {
          element: '#tour-4', popover: {
            title: 'Trossen', description: 'Met behulp van trossen kan je je sessies koppelen aan vakken of taken', onNextClick: () => {
              const vines_modal: HTMLDialogElement = document.getElementById('vines');
              vines_modal.show();

              driverObj.moveNext();
            },
            onPrevClick: () => {
              const stats_modal: HTMLDialogElement = document.getElementById('stats');
              stats_modal.show();
              driverObj.movePrevious();
            }
          }
        },
        {
          element: '#tour-5-box', popover: {
            title: 'Vak toevoegen', description: 'Via deze knop kan je taken of vakken toevoegen',
            onNextClick: () => {
              const vines_modal: HTMLDialogElement = document.getElementById('vines');
              vines_modal.close();

              driverObj.moveNext();
            },
            onPrevClick: () => {
              const vines_modal: HTMLDialogElement = document.getElementById('vines');
              vines_modal.close();

              driverObj.movePrevious();
            }
          },
        },
        {
          popover: {
            title: 'Tour voltooid!', description: 'Bedankt om deze tour te volgen! Hopelijk kan dit programma wat voor je betekenen :)', onPrevClick: () => {
              const vines_modal: HTMLDialogElement = document.getElementById('vines');
              vines_modal.close();

              driverObj.movePrevious();
            }
          }
        }
      ]
    });

    driverObj.drive();
  }
}