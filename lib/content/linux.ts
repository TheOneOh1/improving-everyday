import type { Track } from "./types";

export const linuxTrack: Track = {
  id: "linux",
  title: "Linux",
  description: "Master the Linux operating system from the ground up",
  longDescription:
    "Linux powers 96% of the world's servers. This course takes you from the shell basics through process management, storage, networking, scripting, and security hardening — everything a DevOps engineer needs.",
  icon: "Terminal",
  color: "#f97316",
  gradient: "track-linux-os-gradient",
  tags: ["linux", "shell", "bash", "sysadmin", "devops"],
  modules: [
    {
      id: "linux-fundamentals",
      title: "Linux Fundamentals",
      level: "beginner",
      description: "Understand the Linux architecture, navigate the shell, and manage files and users.",
      lessons: [
        {
          id: "what-is-linux",
          title: "What is Linux?",
          duration: 12,
          type: "lesson",
          description: "Understand the Linux kernel, popular distributions, and why Linux dominates DevOps.",
          objectives: [
            "Explain the Linux kernel and its role",
            "Identify major Linux distributions and their use cases",
            "Understand the Linux file system and user space",
          ],
          content: `# What is Linux?

Linux is an open-source, Unix-like operating system kernel created by **Linus Torvalds** in 1991. It powers everything from smartphones (Android) to the world's top 500 supercomputers, cloud infrastructure, and embedded devices.

## The Linux Architecture

\`\`\`
┌─────────────────────────────────┐
│         User Applications        │
├─────────────────────────────────┤
│     Shell (bash, zsh, fish)      │
├─────────────────────────────────┤
│        System Libraries          │
│         (glibc, musl)            │
├─────────────────────────────────┤
│        Linux Kernel              │
│  Process │ Memory │ File System  │
│  Network │ Device Drivers        │
├─────────────────────────────────┤
│           Hardware               │
└─────────────────────────────────┘
\`\`\`

The **kernel** manages hardware resources. The **shell** is your interface to the kernel. Everything else is user space.

## Major Distributions

| Distribution | Base | Use Case |
|-------------|------|----------|
| Ubuntu 24.04 LTS | Debian | General purpose, cloud, desktop |
| Debian 12 | Independent | Servers, stability-focused |
| RHEL / Rocky Linux | RPM | Enterprise, regulated industries |
| Alpine Linux | Independent | Containers (tiny: ~5MB) |
| Arch Linux | Independent | Advanced users, bleeding edge |
| Amazon Linux 2023 | RHEL-based | AWS EC2 workloads |

## Linux in DevOps

- **98% of containers** run on Linux
- All major cloud providers run Linux hypervisors
- CI/CD runners, Kubernetes nodes, and Docker hosts are Linux
- Bash scripting is the glue of automation

## Key Concepts

**Everything is a file** — devices (/dev/sda), processes (/proc/1234), sockets, pipes — all represented as files.

**Processes** — every running program is a process with a PID. The first process is **systemd** (PID 1).

**Users and permissions** — multi-user system with fine-grained permission model (owner/group/other).

> **Tip:** Use \`uname -a\` to see your kernel version, and \`lsb_release -a\` or \`cat /etc/os-release\` to identify the distribution.

\`\`\`bash
uname -a
# Linux myserver 6.5.0-1022-aws #22-Ubuntu SMP x86_64 GNU/Linux

cat /etc/os-release
# NAME="Ubuntu"
# VERSION="24.04 LTS (Noble Numbat)"

hostnamectl
# Static hostname: myserver
# Operating System: Ubuntu 24.04 LTS
# Kernel: Linux 6.5.0-1022-aws
\`\`\`
`,
        },
        {
          id: "shell-basics",
          title: "Shell Basics & Navigation",
          duration: 16,
          type: "lesson",
          description: "Navigate the Linux filesystem, manage files, and become productive in the terminal.",
          objectives: [
            "Navigate the filesystem with pwd, ls, cd",
            "Create, copy, move and delete files and directories",
            "View file contents with cat, less, head, tail",
            "Use tab completion, history, and aliases",
          ],
          content: `# Shell Basics & Navigation

The shell is your command-line interface to Linux. **Bash** (Bourne Again Shell) is the default on most systems.

## The Prompt

\`\`\`bash
sooraj@server:~\$         # regular user
root@server:/etc#        # root user (# = root)
# user@hostname:cwd prompt/symbol
\`\`\`

## Navigation

\`\`\`bash
pwd                      # print working directory
ls                       # list files
ls -la                   # long format + hidden files
ls -lh                   # human-readable sizes
ls -lt                   # sort by modification time

cd /var/log              # absolute path
cd ..                    # parent directory
cd ~                     # home directory
cd -                     # previous directory
\`\`\`

## Working with Files and Directories

\`\`\`bash
# Create
mkdir mydir
mkdir -p a/b/c           # create nested dirs

touch file.txt           # create empty file
echo "hello" > file.txt  # create with content
echo "more" >> file.txt  # append

# Copy & Move
cp file.txt backup.txt
cp -r mydir/ mydir-copy/ # recursive copy
mv file.txt newname.txt  # rename
mv file.txt /tmp/        # move to /tmp

# Delete
rm file.txt
rm -r mydir/             # recursive (careful!)
rm -rf mydir/            # force (no prompt — dangerous)
rmdir emptydir           # only works if empty
\`\`\`

## Viewing File Contents

\`\`\`bash
cat /etc/hostname         # print entire file
less /var/log/syslog      # pager (q to quit, / to search)
head -20 /var/log/auth.log   # first 20 lines
tail -20 /var/log/auth.log   # last 20 lines
tail -f /var/log/syslog      # follow in real-time (Ctrl+C to stop)
wc -l file.txt               # count lines
\`\`\`

## Finding Things

\`\`\`bash
find /etc -name "*.conf"           # find by name
find /var/log -mtime -1            # modified in last 24h
find / -size +100M 2>/dev/null     # files > 100MB
find /home -user sooraj            # owned by user

which python3                       # path of executable
type ls                             # is it alias/builtin/file?
locate nginx.conf                   # fast (uses database: updatedb)
\`\`\`

## Productivity Tips

\`\`\`bash
# Tab completion — press Tab to autocomplete paths and commands
ls /var/lo[TAB]    →  ls /var/log/

# Command history
history            # show all commands
!!                 # repeat last command
!ssh               # repeat last ssh command
Ctrl+R             # reverse search history

# Aliases (add to ~/.bashrc)
alias ll='ls -la'
alias ..='cd ..'
alias grep='grep --color=auto'

# Useful shortcuts
Ctrl+C   # kill current process
Ctrl+Z   # suspend process (fg to resume)
Ctrl+D   # exit shell / EOF
Ctrl+L   # clear screen (same as 'clear')
Ctrl+A   # move to start of line
Ctrl+E   # move to end of line
\`\`\`

> **Tip:** Run \`man ls\` to read the manual for any command. Press \`q\` to exit. \`tldr ls\` (install tldr) shows practical examples.
`,
        },
        {
          id: "file-permissions",
          title: "File Permissions & Ownership",
          duration: 14,
          type: "lesson",
          description: "Master Linux's rwx permission model, chmod, chown, and special bits.",
          objectives: [
            "Read and interpret permission strings",
            "Use chmod with symbolic and octal notation",
            "Change file ownership with chown and chgrp",
            "Understand setuid, setgid, and sticky bit",
          ],
          content: `# File Permissions & Ownership

Linux controls access to files through a permission system based on **owner**, **group**, and **others**.

## Reading Permissions

\`\`\`bash
ls -la /etc/passwd
# -rw-r--r-- 1 root root 2847 Jan 15 09:12 /etc/passwd
# ↑ ↑↑↑↑↑↑↑↑↑
# │ ││││││││└─ others: r-- (read only)
# │ ││││││└── group:  r-- (read only)
# │ ││││└──── owner:  rw- (read + write)
# │ └──────── file type: - (regular), d (dir), l (link)
# └────────── permissions
\`\`\`

## Permission Values

| Symbol | Octal | Meaning |
|--------|-------|---------|
| r | 4 | Read |
| w | 2 | Write |
| x | 1 | Execute |
| - | 0 | No permission |

**Common combinations:**
- \`rwx\` = 7 (full access)
- \`rw-\` = 6 (read/write)
- \`r-x\` = 5 (read/execute)
- \`r--\` = 4 (read only)

## chmod — Change Permissions

\`\`\`bash
# Octal notation
chmod 755 script.sh      # rwxr-xr-x (owner: all, group+others: r+x)
chmod 644 config.txt     # rw-r--r-- (owner: r+w, others: read)
chmod 600 ~/.ssh/id_rsa  # rw------- (owner only)
chmod 700 ~/.ssh/        # rwx------ (dir: owner only)

# Symbolic notation
chmod u+x script.sh      # add execute for owner (u=user)
chmod g-w file.txt       # remove write from group
chmod o-r secret.txt     # remove read from others
chmod a+r public.txt     # add read for all (a=all)
chmod u=rwx,g=rx,o=r file.sh  # set explicitly

# Recursive
chmod -R 755 /var/www/html/
\`\`\`

## chown — Change Ownership

\`\`\`bash
chown alice file.txt          # change owner
chown alice:developers file.txt  # change owner and group
chown :developers file.txt    # change group only
chgrp developers file.txt     # change group (alternative)

chown -R www-data:www-data /var/www/  # recursive
\`\`\`

## umask — Default Permissions

\`\`\`bash
umask            # show current umask (usually 022)
# Files created with 666 - 022 = 644 (rw-r--r--)
# Dirs created with  777 - 022 = 755 (rwxr-xr-x)

umask 027        # tighten: files=640, dirs=750
\`\`\`

## Special Bits

\`\`\`bash
# Setuid (4): run executable as owner (not caller)
chmod u+s /usr/bin/passwd   # passwd runs as root regardless of who calls
ls -la /usr/bin/passwd
# -rwsr-xr-x  (s in owner execute position)

# Setgid (2): on dir, new files inherit group
chmod g+s /shared/
# New files in /shared get the group of the directory

# Sticky bit (1): on dir, only owner can delete their files
chmod +t /tmp
ls -ld /tmp
# drwxrwxrwt (t in others execute position)
# /tmp: anyone can write, only owner can delete their own files
\`\`\`

> **Security rule:** World-writable files (chmod 777) are dangerous on servers. Always use the minimum permissions needed.
`,
        },
        {
          id: "users-and-groups",
          title: "Users, Groups & sudo",
          duration: 12,
          type: "lesson",
          description: "Manage Linux users and groups, configure sudo, and understand /etc/passwd.",
          objectives: [
            "Create, modify, and delete users and groups",
            "Configure sudo access securely",
            "Understand /etc/passwd, /etc/shadow, /etc/group",
          ],
          content: `# Users, Groups & sudo

## Key Files

\`\`\`bash
cat /etc/passwd   # user accounts
# root:x:0:0:root:/root:/bin/bash
# sooraj:x:1000:1000:Sooraj:/home/sooraj:/bin/bash
# nginx:x:33:33::/var/cache/nginx:/sbin/nologin
# Format: username:password:UID:GID:comment:home:shell

cat /etc/shadow   # hashed passwords (root only)
# sooraj:\$6\$salt\$hashed_password:19000:0:99999:7:::

cat /etc/group    # groups
# sudo:x:27:sooraj,alice
# docker:x:999:sooraj
# Format: groupname:password:GID:members
\`\`\`

## Managing Users

\`\`\`bash
# Create user
useradd -m -s /bin/bash -c "Alice Smith" alice
# -m: create home dir  -s: shell  -c: comment/full name

passwd alice                    # set password
useradd -m -G sudo,docker alice # add to supplementary groups

# Modify user
usermod -aG docker alice        # append to docker group (-a = append)
usermod -s /bin/zsh alice       # change shell
usermod -L alice                # lock account
usermod -U alice                # unlock account

# Delete user
userdel alice                   # keep home dir
userdel -r alice                # delete home dir too

# View user info
id alice                        # uid=1001(alice) gid=1001(alice) groups=...
who                             # who is logged in
w                               # who + what they're doing
last                            # login history
\`\`\`

## Managing Groups

\`\`\`bash
groupadd developers
groupdel developers
groupmod -n devs developers     # rename group

groups sooraj                   # list user's groups
\`\`\`

## sudo Configuration

\`\`\`bash
# Edit sudoers safely
visudo                          # validates syntax before saving

# /etc/sudoers format:
# user  host=(runas)  commands
root    ALL=(ALL:ALL) ALL
alice   ALL=(ALL)     ALL              # full sudo
bob     ALL=(ALL)     NOPASSWD: ALL    # no password prompt
deploy  ALL=(root)    /usr/bin/systemctl restart nginx  # specific command only

# Group-based (preferred)
%sudo   ALL=(ALL:ALL) ALL
%wheel  ALL=(ALL)     ALL

# Drop-in files (safer than editing sudoers directly)
echo "alice ALL=(ALL) NOPASSWD: /usr/bin/apt" > /etc/sudoers.d/alice
chmod 440 /etc/sudoers.d/alice
\`\`\`

## Switching Users

\`\`\`bash
su - alice                      # switch to alice (- loads full env)
sudo -i                         # root shell
sudo -u alice command           # run as alice
sudo !!                         # run last command as root
\`\`\`

> **Security:** Never use \`root\` for daily work. Create a regular user with sudo access. Disable root SSH login.
`,
        },
      ],
    },
    {
      id: "text-processing",
      title: "Text Processing & Shell Tools",
      level: "beginner",
      description: "Process logs and data with grep, sed, awk, cut, sort, and pipes.",
      lessons: [
        {
          id: "grep-sed-awk",
          title: "grep, sed & awk",
          duration: 18,
          type: "lesson",
          description: "Master the three power tools for text processing in Linux.",
          objectives: [
            "Search files with grep and regular expressions",
            "Transform text streams with sed",
            "Process structured data with awk",
            "Combine tools with pipes",
          ],
          content: `# grep, sed & awk

These three tools are the Swiss Army knife of Linux text processing.

## grep — Search

\`\`\`bash
grep "error" /var/log/syslog              # search for pattern
grep -i "error" /var/log/syslog           # case-insensitive
grep -n "error" file.txt                  # show line numbers
grep -c "error" file.txt                  # count matches
grep -v "error" file.txt                  # invert: lines NOT matching
grep -r "password" /etc/                  # recursive search
grep -l "nginx" /etc/                     # only filenames, not content
grep -A 3 "ERROR" app.log                 # 3 lines after match
grep -B 2 "FATAL" app.log                 # 2 lines before match
grep -E "error|warn|fatal" app.log        # extended regex (alternation)
grep -P "\\d{3}-\\d{4}" contacts.txt       # Perl regex

# Real-world examples
grep "Failed password" /var/log/auth.log  # failed SSH attempts
grep -c "GET /api" access.log             # count API hits
grep "404" access.log | awk '{print \$1}' # IPs getting 404s
\`\`\`

## sed — Stream Editor

\`\`\`bash
# Substitution: s/find/replace/flags
sed 's/foo/bar/' file.txt           # replace first occurrence per line
sed 's/foo/bar/g' file.txt          # replace all (g=global)
sed 's/foo/bar/gi' file.txt         # case-insensitive + global
sed -i 's/foo/bar/g' file.txt       # edit file in-place
sed -i.bak 's/foo/bar/g' file.txt   # in-place with backup

# Delete lines
sed '/^#/d' config.conf             # delete comment lines
sed '/^$/d' file.txt                # delete blank lines
sed '5d' file.txt                   # delete line 5
sed '5,10d' file.txt                # delete lines 5-10

# Print specific lines
sed -n '5,10p' file.txt             # print lines 5-10
sed -n '/start/,/end/p' file.txt    # print between patterns

# Real-world
sed -i 's/localhost/db.prod.internal/g' config.yaml
sed '/^#/d; /^$/d' nginx.conf | less  # view config without comments
\`\`\`

## awk — Data Processing

\`\`\`bash
# awk 'pattern { action }' file
# Fields: \$1, \$2, ... \$NF (last), NR (row number), NF (field count)

awk '{print \$1}' file.txt           # print first field
awk '{print \$1, \$3}' file.txt       # print fields 1 and 3
awk -F: '{print \$1}' /etc/passwd    # colon delimiter → print usernames
awk -F, '{print \$2}' data.csv       # CSV second column

# Patterns and conditions
awk 'NR > 1' file.txt               # skip header (first line)
awk '\$3 > 100' data.txt             # rows where field 3 > 100
awk '/error/ {print NR, \$0}' app.log  # print line number + line

# Calculations
awk '{sum += \$1} END {print sum}' numbers.txt
awk '{sum += \$5} END {print "Total:", sum, "Average:", sum/NR}' data.txt

# Real-world: parse nginx access log
# Format: IP - - [date] "METHOD /path HTTP" status bytes
awk '{print \$9}' access.log | sort | uniq -c | sort -rn | head
# Count HTTP status codes

awk '\$9 == 200 {bytes += \$10} END {print "Total bytes:", bytes}' access.log
\`\`\`

## Combining Tools with Pipes

\`\`\`bash
# Find top 10 IPs hitting your server
grep "GET" access.log | awk '{print \$1}' | sort | uniq -c | sort -rn | head -10

# Count failed SSH attempts by IP
grep "Failed password" /var/log/auth.log | awk '{print \$11}' | sort | uniq -c | sort -rn

# Find largest files in /var
du -sh /var/* 2>/dev/null | sort -rh | head -10

# Extract emails from a file
grep -Eo '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' contacts.txt | sort -u
\`\`\`
`,
        },
        {
          id: "archives-pipes",
          title: "Archives, Compression & I/O Redirection",
          duration: 12,
          type: "lesson",
          description: "Compress files, create archives, and master stdin/stdout/stderr redirection.",
          objectives: [
            "Create and extract tar archives",
            "Use gzip, bzip2, and xz compression",
            "Redirect stdin, stdout, and stderr",
            "Use xargs and process substitution",
          ],
          content: `# Archives, Compression & I/O Redirection

## tar — Tape Archive

\`\`\`bash
# Create archives
tar czf backup.tar.gz /etc/           # create gzip-compressed archive
tar cjf backup.tar.bz2 /var/www/      # bzip2 (better compression, slower)
tar cJf backup.tar.xz /home/          # xz (best compression, slowest)

# Extract
tar xzf backup.tar.gz                 # extract in current dir
tar xzf backup.tar.gz -C /restore/    # extract to specific dir

# List contents
tar tzf backup.tar.gz                 # list files without extracting

# Add to existing archive
tar rzf backup.tar.gz newfile.txt

# Common flags: c=create x=extract t=list z=gzip j=bzip2 J=xz f=file v=verbose
\`\`\`

## Compression Tools

\`\`\`bash
gzip file.txt              # creates file.txt.gz (deletes original)
gzip -k file.txt           # keep original
gunzip file.txt.gz         # decompress
gzip -d file.txt.gz        # same as gunzip

bzip2 file.txt             # better compression than gzip
bunzip2 file.txt.bz2

xz file.txt                # best compression ratio
unxz file.txt.xz

zip archive.zip file1 file2 dir/   # zip (cross-platform)
unzip archive.zip
unzip -l archive.zip               # list contents
\`\`\`

## I/O Redirection

\`\`\`bash
# stdout (1) redirection
ls > filelist.txt          # overwrite
ls >> filelist.txt         # append
echo "line" > /dev/null    # discard output

# stderr (2) redirection
find / -name "*.conf" 2>/dev/null       # discard errors
find / -name "*.conf" 2>errors.txt      # errors to file
command > output.txt 2>&1              # both stdout+stderr to file
command &> output.txt                  # shorthand for both

# stdin (0) redirection
wc -l < file.txt           # count lines using file as input
mysql db < dump.sql        # feed SQL file to MySQL

# Pipes
cat /etc/passwd | grep bash | wc -l
\`\`\`

## Useful Utilities

\`\`\`bash
# xargs — build command from stdin
find /tmp -name "*.tmp" | xargs rm        # delete found files
echo "file1 file2 file3" | xargs -n1 echo # one per line
cat urls.txt | xargs -P 4 curl -O         # parallel downloads

# tee — write to file AND stdout
command | tee output.txt                  # see output and save it
command | tee -a output.txt               # append

# sort and uniq
sort file.txt               # alphabetical
sort -n numbers.txt          # numeric
sort -rn numbers.txt         # reverse numeric
sort -k2 data.txt            # sort by field 2
sort -t: -k3 -n /etc/passwd  # sort passwd by UID

sort file.txt | uniq         # remove duplicates (requires sorted input)
sort file.txt | uniq -c      # count occurrences
sort file.txt | uniq -d      # only show duplicates
\`\`\`
`,
        },
      ],
    },
    {
      id: "process-management",
      title: "Process Management",
      level: "intermediate",
      description: "Control running processes, manage system services, and automate with cron.",
      lessons: [
        {
          id: "processes-signals",
          title: "Processes & Signals",
          duration: 14,
          type: "lesson",
          description: "Understand Linux processes, send signals, and manage foreground/background jobs.",
          objectives: [
            "List and inspect processes with ps, top, htop",
            "Send signals with kill and killall",
            "Manage background and foreground jobs",
            "Use nice and renice for priority",
          ],
          content: `# Processes & Signals

## Viewing Processes

\`\`\`bash
ps aux                    # all processes, user-oriented format
# USER  PID %CPU %MEM VSZ RSS TTY STAT START TIME COMMAND

ps aux | grep nginx       # find nginx processes
ps -ef                    # full format (PPID visible)
ps --forest               # show process tree
pstree                    # process tree (install: apt install psmisc)

pgrep nginx               # find PID by name
pgrep -u root             # processes owned by root
pidof nginx               # PIDs of nginx

top                       # interactive process viewer
# Keys: q=quit, k=kill, r=renice, M=sort by memory, P=sort by CPU
htop                      # enhanced top (apt install htop)
\`\`\`

## Process States

| State | Symbol | Meaning |
|-------|--------|---------|
| Running | R | Currently executing |
| Sleeping | S | Waiting (interruptible) |
| Disk sleep | D | Waiting for I/O (uninterruptible) |
| Stopped | T | Paused (Ctrl+Z) |
| Zombie | Z | Dead but not reaped |

## Signals

\`\`\`bash
# Common signals
kill -l                   # list all signals

kill -15 <PID>            # SIGTERM — graceful shutdown (default)
kill    <PID>             # same as -15
kill -9 <PID>             # SIGKILL — force kill (no cleanup possible)
kill -1 <PID>             # SIGHUP  — reload config (nginx, sshd)
kill -2 <PID>             # SIGINT  — same as Ctrl+C
kill -19 <PID>            # SIGSTOP — pause process
kill -18 <PID>            # SIGCONT — continue paused process

killall nginx             # kill all processes named nginx
killall -9 python3        # force kill all python3 processes
pkill -u alice            # kill all processes by user alice

# Always try SIGTERM before SIGKILL — give process time to clean up
\`\`\`

## Background Jobs

\`\`\`bash
sleep 100 &               # run in background (&)
jobs                      # list background jobs
# [1]+ Running    sleep 100 &
# [2]- Stopped    vim file.txt

fg                        # bring last job to foreground
fg %1                     # bring job 1 to foreground
bg %2                     # resume job 2 in background

Ctrl+Z                    # suspend current job
Ctrl+C                    # terminate current job

# Survive terminal close
nohup ./script.sh &       # run detached from terminal
nohup ./script.sh > out.log 2>&1 &

disown %1                 # remove job from shell's job list
\`\`\`

## Process Priority

\`\`\`bash
# Nice value: -20 (highest priority) to 19 (lowest)
nice -n 10 ./backup.sh    # start with lower priority
nice -n -5 ./critical.sh  # start with higher priority (root only for negative)

renice 15 -p 1234         # change priority of running process
renice -n 5 -u alice      # change all of alice's processes
\`\`\`

## System Resources

\`\`\`bash
free -h                   # memory usage
vmstat 2 5                # virtual memory stats (every 2s, 5 times)
iostat -x 2               # I/O stats per disk
uptime                    # load averages (1min, 5min, 15min)
# Load avg > number of CPU cores = system overloaded
nproc                     # number of CPU cores
lscpu                     # CPU details
\`\`\`
`,
          interviewQuestions: [
            {
              question: "A process is consuming 100% CPU on a production server. How do you find it and deal with it?",
              difficulty: "mid" as const,
              answer: `**Step 1 — Identify the process:**
\`\`\`bash
# Real-time process view:
top          # press P to sort by CPU
htop         # more visual, easier to navigate

# Quick snapshot:
ps aux --sort=-%cpu | head -20  # top CPU consumers

# If it's a Java process, find what it's doing:
PID=$(ps aux --sort=-%cpu | awk 'NR==2{print $2}')
\`\`\`

**Step 2 — Investigate what it's doing:**
\`\`\`bash
# What system calls is it making?
strace -p $PID -c -f 2>&1 | head -30
# -c: count syscalls (summary), -f: follow threads

# What files does it have open?
lsof -p $PID | head -30

# What's in its stack trace? (for compiled code)
gdb -p $PID -batch -ex "thread apply all bt" 2>/dev/null

# For Java: get thread dump
kill -3 $PID  # prints thread dump to stdout
jstack $PID   # Java thread dump tool

# Check if it's in a spin loop:
watch -n 1 'ps aux --sort=-%cpu | head -5'
# If CPU stays at 100% without drops → likely infinite loop, not I/O wait
\`\`\`

**Step 3 — Assess and respond:**
\`\`\`bash
# Is it a critical production process?
# YES: investigate first, kill only if it's causing broader outage

# Reduce priority without killing (buy time):
renice +15 -p $PID  # lower priority so other processes get CPU

# Graceful shutdown:
kill -15 $PID  # SIGTERM — ask process to shut down
# If it doesn't respond after 30s:
kill -9 $PID   # SIGKILL — force kill (no cleanup)
\`\`\`

**Common root causes:**
- Infinite loop in application code (check recent deployments)
- Runaway query without proper index (database query consuming CPU)
- Log rotation causing massive file processing
- Crypto mining malware (check if process name is unusual)`,
            },
            {
              question: "Explain the Linux process lifecycle: fork(), exec(), wait(), and zombie processes.",
              difficulty: "senior" as const,
              answer: `**The fork-exec model:**

Every process (except init/PID 1) is created by \`fork()\`:
\`\`\`
fork() → creates an EXACT COPY of the parent process
         child gets a new PID, parent's PID becomes child's PPID
         copy-on-write: shares parent's memory pages until written

exec() → replaces the child's memory with a new program
         the child is now a completely different program
         PID remains the same

Example: bash running 'ls':
1. bash fork()s → new process, PID 12345, exact copy of bash
2. child exec()s ls → PID 12345 is now the ls program
3. ls runs, outputs, exits
4. bash wait()s → collects exit status, child entry cleaned from process table
\`\`\`

**Zombie processes:**
\`\`\`bash
# A zombie is a process that exited but parent hasn't called wait():
# The child is dead but still in the process table (PID kept for parent to collect status)

ps aux | grep Z  # Z = zombie state

# How zombies happen:
# Parent creates child, child exits
# Parent is too busy (or has a bug) and never calls wait()
# Child lingers as zombie

# Fix:
# 1. Kill the PARENT (zombie children are adopted by init/PID 1, which calls wait())
kill -9 <parent_PID>

# 2. Fix the parent's code to call waitpid() properly
# 3. If parent can't be killed: reboot (last resort)
\`\`\`

**Signals and process control:**
\`\`\`bash
# Common signals:
SIGTERM (15) = graceful shutdown request (can be caught and handled)
SIGKILL (9)  = immediate kill (cannot be caught, always works)
SIGINT (2)   = Ctrl+C
SIGHUP (1)   = terminal hangup (many daemons reload config on SIGHUP)
SIGSTOP (19) = pause (cannot be caught)
SIGCONT (18) = resume paused process

# Rule: always try SIGTERM first, wait 30s, then SIGKILL
kill -15 $PID && sleep 30 && kill -9 $PID 2>/dev/null
\`\`\``,
            },
          ],
        },
        {
          id: "systemd-services",
          title: "Systemd & Service Management",
          duration: 16,
          type: "lesson",
          description: "Manage Linux services with systemd, write unit files, and use journald logging.",
          objectives: [
            "Start, stop, and enable services with systemctl",
            "Read logs with journalctl",
            "Write a custom systemd service unit",
            "Understand systemd targets (runlevels)",
          ],
          content: `# Systemd & Service Management

Systemd is the init system for most modern Linux distributions. It starts and manages all system services.

## systemctl — Service Control

\`\`\`bash
# Service lifecycle
systemctl start nginx          # start service
systemctl stop nginx           # stop service
systemctl restart nginx        # stop + start
systemctl reload nginx         # reload config without restart (if supported)
systemctl status nginx         # detailed status

# Persistence across reboots
systemctl enable nginx         # start at boot
systemctl disable nginx        # don't start at boot
systemctl enable --now nginx   # enable + start immediately

# Query
systemctl is-active nginx      # active or inactive
systemctl is-enabled nginx     # enabled or disabled
systemctl list-units --type=service --state=running
systemctl list-unit-files --type=service
\`\`\`

## journalctl — Log Viewer

\`\`\`bash
journalctl                          # all logs (oldest first)
journalctl -r                       # reverse (newest first)
journalctl -f                       # follow (like tail -f)
journalctl -n 50                    # last 50 lines
journalctl -u nginx                 # logs for nginx service
journalctl -u nginx -f              # follow nginx logs
journalctl --since "2024-01-15"     # logs since date
journalctl --since "1 hour ago"     # relative time
journalctl -p err                   # only errors (emerg,alert,crit,err)
journalctl -p warning..err          # warnings to errors
journalctl --no-pager | grep "Out of memory"
\`\`\`

## Writing a Custom Service

Create \`/etc/systemd/system/myapp.service\`:

\`\`\`ini
[Unit]
Description=My Application Server
Documentation=https://myapp.example.com/docs
After=network.target postgresql.service
Requires=postgresql.service

[Service]
Type=simple
User=myapp
Group=myapp
WorkingDirectory=/opt/myapp
Environment=NODE_ENV=production
Environment=PORT=3000
EnvironmentFile=/etc/myapp/config.env

ExecStart=/usr/bin/node /opt/myapp/server.js
ExecReload=/bin/kill -HUP \$MAINPID
Restart=on-failure
RestartSec=5s
StandardOutput=journal
StandardError=journal

# Security hardening
NoNewPrivileges=true
ProtectSystem=strict
PrivateTmp=true

[Install]
WantedBy=multi-user.target
\`\`\`

\`\`\`bash
systemctl daemon-reload           # reload unit files after changes
systemctl enable --now myapp
systemctl status myapp
journalctl -u myapp -f
\`\`\`

## Systemd Targets (Runlevels)

\`\`\`bash
systemctl get-default             # current default target
systemctl set-default multi-user.target  # no GUI on boot

# Common targets:
# poweroff.target  — shutdown
# rescue.target    — single-user (recovery)
# multi-user.target — normal (no GUI)
# graphical.target  — normal + GUI
\`\`\`

## Timers (Cron Alternative)

\`\`\`bash
# /etc/systemd/system/backup.timer
# [Unit]
# Description=Daily Backup Timer
# [Timer]
# OnCalendar=daily
# Persistent=true
# [Install]
# WantedBy=timers.target

systemctl enable --now backup.timer
systemctl list-timers
\`\`\`
`,
        },
      ],
    },
    {
      id: "shell-scripting",
      title: "Shell Scripting",
      level: "intermediate",
      description: "Automate tasks with Bash scripting from fundamentals to production-ready scripts.",
      lessons: [
        {
          id: "bash-fundamentals",
          title: "Bash Scripting Fundamentals",
          duration: 20,
          type: "lesson",
          description: "Learn variables, conditionals, loops, functions, and best practices.",
          objectives: [
            "Write scripts with variables, conditionals, and loops",
            "Handle arguments and user input",
            "Use functions and return values",
            "Apply error handling with set -euo pipefail",
          ],
          content: `# Bash Scripting Fundamentals

## Script Structure

\`\`\`bash
#!/usr/bin/env bash
# ^^^ Shebang: always use env to find bash portably
set -euo pipefail
# -e: exit on error  -u: error on undefined var  -o pipefail: catch pipe errors

# Script: deploy.sh
# Usage: ./deploy.sh <environment> <version>
\`\`\`

## Variables

\`\`\`bash
name="Alice"                    # no spaces around =
echo "\$name"                    # variable reference
echo "\${name}_backup"           # brace syntax (required for adjacent text)
readonly PI=3.14                # constant (cannot be changed)
unset name                      # delete variable

# Command output
today=\$(date +%Y-%m-%d)
files=\$(ls -1 | wc -l)
echo "Today: \$today, Files: \$files"

# Arithmetic
x=10
y=3
echo \$((x + y))                 # 13
echo \$((x * y))                 # 30
echo \$((x / y))                 # 3 (integer division)
echo \$((x % y))                 # 1 (modulo)
((x++))                         # increment

# Special variables
echo "\$0"    # script name
echo "\$1"    # first argument
echo "\$2"    # second argument
echo "\$@"    # all arguments (as list)
echo "\$#"    # number of arguments
echo "\$?"    # exit code of last command
echo "\$\$"    # current script PID
\`\`\`

## Strings

\`\`\`bash
str="Hello, World!"
echo "\${#str}"                  # length: 13
echo "\${str:0:5}"               # substring: Hello
echo "\${str/World/Linux}"       # replace: Hello, Linux!
echo "\${str,,}"                 # lowercase
echo "\${str^^}"                 # uppercase
echo "\${str%!}"                 # remove suffix
\`\`\`

## Conditionals

\`\`\`bash
# if/elif/else
if [[ "\$1" == "prod" ]]; then
  echo "Production mode"
elif [[ "\$1" == "staging" ]]; then
  echo "Staging mode"
else
  echo "Unknown environment"
  exit 1
fi

# Test operators
[[ -f file.txt ]]     # file exists
[[ -d /etc ]]         # directory exists
[[ -z "\$var" ]]       # string is empty
[[ -n "\$var" ]]       # string is non-empty
[[ "\$a" == "\$b" ]]   # strings equal
[[ "\$a" != "\$b" ]]   # strings not equal
[[ \$x -gt 10 ]]      # numeric greater than
[[ \$x -le 5 ]]       # numeric less than or equal
[[ -r file ]]         # file is readable
[[ -w file ]]         # file is writable
[[ -x file ]]         # file is executable

# Combining
[[ -f "\$file" && -r "\$file" ]]    # AND
[[ "\$env" == "prod" || "\$env" == "staging" ]]  # OR
[[ ! -d "\$dir" ]]                  # NOT
\`\`\`

## Loops

\`\`\`bash
# For loop
for i in 1 2 3 4 5; do
  echo "Item: \$i"
done

for file in /etc/*.conf; do
  echo "Config: \$file"
done

for ((i=0; i<10; i++)); do
  echo "Count: \$i"
done

# While loop
count=0
while [[ \$count -lt 5 ]]; do
  echo "Count: \$count"
  ((count++))
done

# Read from file
while IFS= read -r line; do
  echo "Processing: \$line"
done < input.txt

# Read from command output
while IFS= read -r server; do
  ping -c1 "\$server" && echo "\$server is up"
done < servers.txt
\`\`\`

## Functions

\`\`\`bash
log() {
  local level="\$1"   # local = scoped to function
  local message="\$2"
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] [\$level] \$message"
}

deploy() {
  local env="\$1"
  local version="\$2"

  log "INFO" "Deploying version \$version to \$env"
  # ... deployment logic ...
  return 0   # success (non-zero = failure)
}

deploy "staging" "v1.2.3"

# Functions with return values via echo
get_ip() {
  hostname -I | awk '{print \$1}'
}
my_ip=\$(get_ip)
\`\`\`

## Error Handling

\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail

# Trap for cleanup
cleanup() {
  echo "Cleaning up..."
  rm -f /tmp/work.$$
}
trap cleanup EXIT           # always runs on exit
trap 'echo "Error on line \$LINENO"' ERR

# Check command success
if ! aws s3 cp file.txt s3://my-bucket/; then
  echo "Upload failed" >&2   # write to stderr
  exit 1
fi

# Provide defaults
ENV="\${1:-development}"     # default to "development" if \$1 unset
\`\`\`

## Production Script Example

\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIR="\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
readonly LOG_FILE="/var/log/deploy.log"

log() { echo "[$(date -Iseconds)] \$*" | tee -a "\$LOG_FILE"; }
die() { log "ERROR: \$*" >&2; exit 1; }

[[ \$# -lt 2 ]] && die "Usage: \$0 <env> <version>"

ENV="\$1"
VERSION="\$2"

[[ "\$ENV" =~ ^(dev|staging|prod)\$ ]] || die "Invalid env: \$ENV"

log "Starting deployment of \$VERSION to \$ENV"
# ... rest of script
log "Deployment complete"
\`\`\`
`,
        },
      ],
    },
    {
      id: "linux-security",
      title: "Security Hardening",
      level: "advanced",
      description: "Harden Linux systems following CIS benchmarks and industry best practices.",
      lessons: [
        {
          id: "system-hardening",
          title: "Linux Security Hardening",
          duration: 18,
          type: "lesson",
          description: "Apply CIS benchmarks, configure firewall rules, and implement audit logging.",
          objectives: [
            "Apply kernel security parameters with sysctl",
            "Configure UFW/iptables firewall rules",
            "Set up fail2ban for brute-force protection",
            "Enable auditd for compliance logging",
          ],
          content: `# Linux Security Hardening

## SSH Hardening

Edit \`/etc/ssh/sshd_config\`:

\`\`\`bash
# Disable root login
PermitRootLogin no

# Disable password auth (use keys only)
PasswordAuthentication no
PubkeyAuthentication yes

# Limit users
AllowUsers alice bob deploy

# Reduce attack surface
Protocol 2
MaxAuthTries 3
LoginGraceTime 30
ClientAliveInterval 300
ClientAliveCountMax 2
X11Forwarding no

systemctl reload sshd
\`\`\`

## Firewall with UFW

\`\`\`bash
ufw default deny incoming         # block all inbound
ufw default allow outgoing        # allow all outbound

ufw allow 22/tcp                  # SSH
ufw allow 80/tcp                  # HTTP
ufw allow 443/tcp                 # HTTPS
ufw allow from 10.0.0.0/8 to any port 5432  # PostgreSQL from internal only

ufw enable
ufw status verbose
ufw status numbered               # numbered rules for deletion
ufw delete 3                      # delete rule by number
\`\`\`

## fail2ban — Brute-Force Protection

\`\`\`bash
apt install fail2ban

# /etc/fail2ban/jail.local
cat <<'EOF' > /etc/fail2ban/jail.local
[DEFAULT]
bantime  = 1h
findtime = 10m
maxretry = 5
banaction = ufw

[sshd]
enabled = true
maxretry = 3

[nginx-http-auth]
enabled = true
EOF

systemctl enable --now fail2ban
fail2ban-client status sshd      # view banned IPs
fail2ban-client set sshd unbanip 1.2.3.4
\`\`\`

## Kernel Hardening (sysctl)

\`\`\`bash
# /etc/sysctl.d/99-hardening.conf
cat <<'EOF' > /etc/sysctl.d/99-hardening.conf
# Disable IP forwarding (unless router/k8s node)
net.ipv4.ip_forward = 0

# Prevent SYN flood
net.ipv4.tcp_syncookies = 1

# Don't respond to broadcasts (smurf attack)
net.ipv4.icmp_echo_ignore_broadcasts = 1

# Disable source routing
net.ipv4.conf.all.accept_source_route = 0

# Enable ASLR (randomize memory layout)
kernel.randomize_va_space = 2

# Restrict kernel logs to root
kernel.dmesg_restrict = 1

# Restrict ptrace to child processes
kernel.yama.ptrace_scope = 1
EOF

sysctl --system           # apply all sysctl.d files
sysctl -p /etc/sysctl.d/99-hardening.conf
\`\`\`

## auditd — Audit Logging

\`\`\`bash
apt install auditd

# Watch sensitive files
auditctl -w /etc/passwd -p wa -k user_changes
auditctl -w /etc/sudoers -p wa -k sudoers_changes
auditctl -w /var/log/auth.log -p wa -k auth_log

# Watch for privileged commands
auditctl -a always,exit -F arch=b64 -S execve -F euid=0 -k root_commands

# Query audit log
ausearch -k user_changes          # filter by key
ausearch -m USER_LOGIN --start today
aureport --login --start this-week --summary
\`\`\`

## Automatic Updates

\`\`\`bash
apt install unattended-upgrades

# /etc/apt/apt.conf.d/50unattended-upgrades
# Enable security updates automatically
Unattended-Upgrade::Allowed-Origins {
    "\${distro_id}:\${distro_codename}-security";
};
Unattended-Upgrade::Automatic-Reboot "false";

dpkg-reconfigure -plow unattended-upgrades
\`\`\`

## Security Checklist

\`\`\`bash
# Check for world-writable files
find / -xdev -type f -perm -0002 2>/dev/null

# Check for SUID/SGID files (review these carefully)
find / -xdev -type f \\( -perm -4000 -o -perm -2000 \\) 2>/dev/null

# Check for empty passwords
awk -F: '($2 == "") {print}' /etc/shadow

# List users with UID 0 (root-equivalent)
awk -F: '($3 == 0) {print}' /etc/passwd

# Check listening services
ss -tlnp

# CIS benchmark scanning
apt install lynis
lynis audit system
\`\`\`
`,
        },
      ],
    },
  ],
};
