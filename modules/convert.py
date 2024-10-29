import av


def convert_webm_to_mp3(input_file_path, output_file_path):
    with av.open(input_file_path, "r") as inp:
        with av.open(output_file_path, "w", format="mp3") as out:
            out_stream = out.add_stream("mp3")
            for frame in inp.decode(audio=0):
                frame.pts = None
                for packets in out_stream.encode(frame):
                    out.mux(packets)
            for packets in out_stream.encode(None):
                out.mux(packets)
