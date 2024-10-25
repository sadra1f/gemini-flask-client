import os
import signal
import subprocess

if __name__ == "__main__":
    node_process = None

    def kill_process(pid: int):
        try:
            os.killpg(os.getpgid(pid), signal.SIGTERM)
        except:
            pass

    try:
        node_process = subprocess.Popen(
            ["yarn", "build"],
            stderr=subprocess.STDOUT,
        ).wait()

    except:
        if node_process:
            node_process.terminate()
        kill_process(node_process.pid)
