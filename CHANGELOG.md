## v0.3.2 (2025-10-30)

### Fix

- copy package.json to the correct location in Dockerfile

## v0.3.1 (2025-10-30)

### Fix

- copy package.json to the correct location in Dockerfile

## v0.3.0 (2025-10-30)

### Feat

- update translations

### Fix

- incorrect translation

## v0.2.0 (2025-10-30)

### Feat

- add extra error message to inform the user when the backend server is down
- enhance graph options and statistics visualization
- add christmas and halloween themes
- error handling for login / register
- add wakelock functionality
- remove vines drag-and-drop, replace with more intuitive UI for changing parent of vine
- add fab button to enhance mobile experience
- add time travel functionality in dev mode
- update translations
- add language detection
- make app more responsive
- automatically publish docker image to remote server on master push
- change default themes
- add version number next to logo
- add vine reordering
- add timer volume controls
- sessions can span multiple days
- add more graph options
- add task management functionality; added task time tracking; added task categories in statsmodal; added automatic migration of stats localStorage so that no manual action is required; updated type controls to make use of snippets
- add debug logging messages
- add languages using paraglide
- add theming support; remove svelte-sound code
- Add week controls to stats graph
- Add Netlify adapter for SvelteKit to support deployment on Netlify
- Add Statsmodal component with ECharts integration for displaying statistics of the past week
- Introduce StatsManager for session statistics tracking and update session handling

### Fix

- alerts and modals not stackable
- new session not remembering current vine when previous one is skipped / completed
- day stats not visible
- recursive vines blocking application
- remove vine status property and add additional guards to vine replacing
- vine modal not showing
- filter by name not working
- double digits would not display for numbers under 10 in timer
- use svelte element binding for echarts initialisation
- avoid deleted vines causing the histogram to fail rendering
- timer not updating after session completion
- changing pomo type does not result in a new session being created
- application does not respect theme setting
- incorrect title when timer active
- solve various problems with onboarding ui
- don't copy package.lock.json to docker image
- solve echarts crash
- shorten initial tour and add functionality to move to the previous step
- various bug fixes regarding vine-specific histograms
- solve problem where pie chart would show only parent vine
- update vine status to active when checkbox selected and remove unused vine reference
- fix bug where focus time for vines would show correctly
- copy over pb_hooks into container
- introduce bug to check if pocketbase is loading js files
- delete kairos executable
- add pb_data as volume to fix database persistence
- debug push handlers
- debug push handlers
- log settings push requests to debug issue
- remove hardcoded superuser token
- bind pocketbase server to 0.0.0.0 instead of localhost, upgrade alpine image
- update sync-indicator to be compatible with rxdb
- paraglide problem
- paraglide problem
- paraglide problem
- certain tests failing when started in parallel
- changing timer settings did not recreate session with new timer values
- paraglide import paths
- incorrect paraglide import path; third time's a charm ;)
- incorrect paraglide import path
- incorrect paraglide import path
- incorrect translations
- time_real would retain value when session was skipped after Pomodoro / Pauze / Lange pauze button press, causing arbitratry session registration
- skip session on Pomodoro / Pauze / Lange pauze press, so that stats are updated
- see previous commit, issue wasn't completely resolved; fix typo
- paused session would include time spent outside of session

### Refactor

- make modals more independent
- solve some editor problems
- unify session management under app_state context
- rework timer logic depend less on difficult to debug session subscription
- simplify data handling in histogram functions and improve tooltip formatting
- add pb_hooks to gitignore
- use json schema for pocketbase initial setup
- clean up unused files
- reorganise imports / exports
- remove legacy code
- remove bun lockfile from frontend
- add npm workspaces for frontend and backend
- remove some unused files and move session types to schema definition
- **database**: switch to IndexedDB (Dexie.js) for database management
- reorganise codebase; translate dutch symbols to english
- store state_manager as svelte state
- Refactor session management: Rename Sessie to Session, update related logic and state handling. Remove old session tests and implementation. Introduce utility functions for deep copy and stringify.


- add pocketbase backend
