here are some development scripts that i need to remember

- `for f in *.full.mp4 ; do ffmpeg -i "$f -s 192x144 ../mp4/"${f%.full.mp4}.mp4" ; done`
- `ffmpeg -i lucycanontaro.mp4 -vf "scale=192x144:force_original_aspect_ratio=decrease,pad=192x144:-1:-1:color=black" ../mp4/lucycanontaro.mp4`
- `ffmpeg -i v.mp4 -i a.wav -c:v copy -map 0:v:0 -map 1:a:0 new.mp4`
- `ffmpeg -i juandefuca2025.mp4 -filter:v 'crop=ih/3*4:ih' -c:v libx264 -crf 23 -preset veryfast -c:a copy output.mp4`
