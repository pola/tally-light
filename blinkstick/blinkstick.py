#!/usr/bin/python3
import asyncio, config, json, time, websockets
from blinkstick import blinkstick

def go():
    b = blinkstick.find_first()

    b.set_color(name='blue')

    async def tally():
        while True:
            try:
                async with websockets.connect(config.url) as websocket:
                    await websocket.send(config.me)

                    while True:
                        data = await websocket.recv()
                        data = json.loads(data)

                        if data is None:
                            b.turn_off()
                        
                        else:
                            b.set_color(name='red' if config.me in data else 'white')
                
            except Exception as e:
                print('network error')
                b.turn_off()
                time.sleep(5)

    asyncio.get_event_loop().run_until_complete(tally())

while True:
    try:
        go()
    
    except Exception:
        print('blinkstick error')
        time.sleep(5)
