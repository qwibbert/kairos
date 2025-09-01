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
        { popover: { title: 'Hallo daar!', description: 'Kairos is een applicatie waarmee je studietijd beter kan indelen en bijhouden aan de hand van de Pomodoro techniek.' } },
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
            }
          }
        },
        {
          element: '#tour-3', popover: {
            title: 'Statistieken', description: 'Iedereen houdt stiekem wel van wat statistieken, hier kan je ze bekijken.', onNextClick: () => {
              const stats_modal: HTMLDialogElement = document.getElementById('stats');
              stats_modal.show();
              driverObj.moveNext();
            }
          }
        },
        {
          element: '#stats', popover: {
            title: 'Statistieken', description: 'Momenteel ziet het er wat leegjes uit! Tijd om daar verandering in te brengen :)', onNextClick: () => {
              const stats_modal: HTMLDialogElement = document.getElementById('stats');
              stats_modal.close();
              driverObj.moveNext();
            }
          }
        },
        {
          element: '#tour-4', popover: {
            title: 'Trossen', description: 'Met behulp van trossen kan je je sessies koppelen aan vakken of taken', onNextClick: () => {
              const vines_modal: HTMLDialogElement = document.getElementById('vines');
              vines_modal.show();

              driverObj.moveNext();
            }
          }
        },
        {
          element: '#tour-5-box', popover: {
            title: 'Vak toevoegen', description: 'Laten we eens proberen om een vak toe te voegen!', onNextClick: () => {
              const box: HTMLDetailsElement = document.getElementById('tour-5-box');
              box.open = true;

              const course_button: HTMLDialogElement = document.getElementById('tour-5-course');
              course_button.addEventListener('click', (e) => {
                e.preventDefault();

                const vines_modal: HTMLDialogElement = document.getElementById('vines');
                vines_modal.close();

                const import_course: HTMLDialogElement = document.getElementById('import-course');
                import_course.show();

                const box: HTMLDetailsElement = document.getElementById('tour-5-box');
                box.open = false;

                driverObj.moveNext();
              });

              driverObj.moveNext();
            }
          }
        },
        {
          element: '#tour-5-course', popover: {
            title: 'Vak toevoegen', description: 'Klik op "vak toevoegen" om verder te gaan.', showButtons: ['previous']
          }
        },
        {
          element: '#import-course', popover: {
            title: 'Vak toevoegen', description: 'Na je onderwijsinstelling te selecteren, kan je zoeken naar vakken. Laten we het vak "Programmeren" toevoegen.', onNextClick: () => {
              document.getElementById('course-input')?.addEventListener('input', (e) => {
                console.log(e.target.value, toString(e.srcElement.value).toLowerCase())
                if (e.srcElement.value.toLowerCase() == 'programmeren') {
                  console.log('yeahhh')
                  driverObj.moveNext();
                }
              });

              driverObj.moveNext();
            }
          },

        },
        { element: '#course-input', popover: { title: 'Vak toevoegen', description: 'Typ "programmeren" in de zoekbalk.', showButtons: ['previous'] }, },
        {
          element: '#tour-course', popover: {
            title: 'Vak toevoegen', description: 'Dit is het vak dat we zoeken!', onNextClick: () => {
              document.querySelector('#tour-course > button').addEventListener('click', () => {
                console.log('test!')
                const import_course: HTMLDialogElement = document.getElementById('import-course');
                import_course.close();

                const vines_modal: HTMLDialogElement = document.getElementById('vines');
                vines_modal.show();



                driverObj.moveNext();
              })

              driverObj.moveNext();
            }
          },
        },
        { element: '#tour-course > button', popover: { title: 'Vak toevoegen', description: 'Klik op deze knop om verder te gaan!' } },
        { element: '#vines', popover: { title: 'Vak toevoegen', description: 'Het is je gelukt! Je kan vakken en taken ook omzetten naar mappen. Dit is bijvoorbeeld handig wanneer je wil bijhouden hoe lang je precies aan een hoofdstuk zit of je vakken wil bundelen per studiejaar en / of per semester.' } },
        {
          element: '#vines-container > li:nth-child(1) > div.join.bg-base-300.rounded-box > button:nth-child(2)', popover: {
            title: 'Mappen', description: 'Dat doe je door op deze knop te klikken.', onNextClick: () => {
              const vines_modal: HTMLDialogElement = document.getElementById('vines');
              vines_modal.close();
              driverObj.moveNext();
            }
          }
        },
        { popover: { title: 'Einde', description: 'Bedankt om deze tutorial te volgen! Hopelijk kan dit programma wat voor je betekenen :)' } }
      ]
    });

    driverObj.drive();
  }
}