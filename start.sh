tmux new-session -s sponsorenlauf -d 'cd client; yarn run relay --watch'
tmux split-window -v -t 0 'cd server; yarn prisma2 dev'
tmux split-window -v -t 0 'cd client; yarn run start'
tmux split-window -v -t 2 'cd server; yarn run dev'
tmux attach-session -t sponsorenlauf

