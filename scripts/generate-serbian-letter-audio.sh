#!/usr/bin/env bash

set -euo pipefail

output_dir="public/audio/letters-sr"
temp_dir="${TMPDIR:-/tmp}/deda-serbian-letter-audio"
voice="Milena"

mkdir -p "$output_dir" "$temp_dir"

filenames=(
  01-a 02-b 03-v 04-g 05-d 06-dj-soft 07-e 08-zh 09-z 10-i
  11-y 12-k 13-l 14-l-soft 15-m 16-n 17-n-soft 18-o 19-p 20-r
  21-s 22-t 23-ch-soft 24-u 25-f 26-h 27-ts 28-ch 29-dzh 30-sh
)

sounds=(
  а б в г д джь э ж з и
  й к л ль м н нь о п р
  с т чь у ф х ц ч дж ш
)

for index in "${!filenames[@]}"; do
  source_file="$temp_dir/${filenames[$index]}.aiff"
  target_file="$output_dir/${filenames[$index]}.wav"
  say -v "$voice" -o "$source_file" "${sounds[$index]}"
  afconvert -f WAVE -d LEI16@24000 "$source_file" "$target_file"
done
