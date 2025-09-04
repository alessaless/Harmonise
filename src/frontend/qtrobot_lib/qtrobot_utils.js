// qtrobot function

const QT = (() => {
    let ros = null;
    let connected = false;

    // Service clients riutilizzabili
    let svc = {
        setVolume: null,
        speechConfig: null,
        speechSay: null,
        emotionShow: null,
    };

    // Publisher riutilizzabili
    let pub = {
        speechSay: null,
    };

    // --- util: chiama un servizio come Promise
    function callService(service, requestObj, { timeoutMs = 8000 } = {}) {
        return new Promise((resolve, reject) => {
            if (!connected) return reject(new Error('ROS non connesso'));
            let done = false;

            const t = setTimeout(() => {
                if (!done) {
                    done = true;
                    reject(new Error('Service timeout'));
                }
            }, timeoutMs);

            service.callService(
                new ROSLIB.ServiceRequest(requestObj),
                (res) => {
                    if (done) return;
                    done = true;
                    clearTimeout(t);
                    resolve(res);
                },
                (err) => {
                    if (done) return;
                    done = true;
                    clearTimeout(t);
                    reject(err instanceof Error ? err : new Error(String(err)));
                }
            );
        });
    }

    // --- init: connessione + service clients + publishers
    async function init(rosbridgeUrl = 'ws://192.168.100.2:9091') {
        if (ros && connected) return; // già pronto

        ros = new ROSLIB.Ros({ url: rosbridgeUrl });

        ros.on('connection', () => {
            connected = true;
            console.log('[QT] Connected to', rosbridgeUrl);
        });

        ros.on('close', () => {
            connected = false;
            console.warn('[QT] Connection closed');
        });

        ros.on('error', (e) => {
            console.error('[QT] Connection error:', e);
        });

        // attendo connessione (o errore/timeout)
        await new Promise((resolve, reject) => {
            const start = Date.now();
            const maxWait = 7000; // ms

            const check = () => {
                if (connected) return resolve();
                if (Date.now() - start > maxWait) {
                    return reject(new Error('Connessione a rosbridge scaduta'));
                }
                setTimeout(check, 150);
            };
            check();
        });

        // istanzio i service client UNA VOLTA
        svc.setVolume = new ROSLIB.Service({
            ros, name: '/qt_robot/setting/setVolume',
            serviceType: 'qt_robot_interface/setting_setVolume',
        });

        svc.speechConfig = new ROSLIB.Service({
            ros, name: '/qt_robot/speech/config',
            serviceType: 'qt_robot_interface/speech_config',
        });

        svc.speechSay = new ROSLIB.Service({
            ros, name: '/qt_robot/speech/say',
            serviceType: 'qt_robot_interface/speech_say',
        });

        svc.emotionShow = new ROSLIB.Service({
            ros, name: '/qt_robot/emotion/show',
            serviceType: 'qt_robot_interface/emotion_show',
        });

        // istanzio il publisher UNA VOLTA
        pub.speechSay = new ROSLIB.Topic({
            ros,
            name: '/qt_robot/speech/say',
            messageType: 'std_msgs/String',
        });

        console.log('[QT] Service clients & publishers ready');
    }

    // --- configure: volume + lingua (chiamala dopo login)
    async function configure({ volume = null, language = null } = {}) {
        if (!connected) throw new Error('Non connesso. Chiama QT.init() prima.');

        if (typeof volume === 'number') {
            const v = Math.max(0, Math.min(100, Math.round(volume)));
            await callService(svc.setVolume, { volume: v });
            console.log('[QT] Volume impostato a', v);
        }

        if (typeof language === 'string' && language.length > 0) {
            await callService(svc.speechConfig, { language });
            console.log('[QT] Lingua impostata a', language);
        }
    }

    // --- say: service (più lento, ma con ack)
    async function say(text) {
        if (!connected) throw new Error('Non connesso. Chiama QT.init() prima.');
        if (!text || !text.trim()) return;
        await callService(svc.speechSay, { message: text });
        console.log('[QT] Say (service):', text);
    }

    // --- emotion opzionale
    async function showEmotion(name = 'QT/happy') {
        if (!connected) throw new Error('Non connesso. Chiama QT.init() prima.');
        await callService(svc.emotionShow, { name });
        console.log('[QT] Emotion:', name);
    }

    // API pubblica
    return { init, configure, say, showEmotion };
})();
