import obspython as obs
import sys
import config

if config.python_lib_path is not None:
    sys.path.append(config.python_lib_path)

import requests


def script_load(settings):
    sh = obs.obs_get_signal_handler()

    obs.signal_handler_connect(sh, 'source_activate', enabled)
    obs.signal_handler_connect(sh, 'source_deactivate', disabled)


def change(s, enabled):
    source = obs.calldata_source(s, 'source')

    if source is not None:
        source_type = obs.obs_source_get_id(source)
        name = obs.obs_source_get_name(source)

        print('detected change in ' + name + ' (' + source_type + ')')

        if len(config.source_types) == 0 or source_type in config.source_types:
            print('informing')
            requests.put(config.server + '/change', json={
                'enabled': [name],
            })


def enabled(s):
    change(s, True)


def disabled(s):
    change(s, False)


def script_description():
    return 'Sends information about source and scene switching to a server.'
