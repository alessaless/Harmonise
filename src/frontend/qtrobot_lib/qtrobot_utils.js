// qtrobot function
/*
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


    // dentro init(), dopo aver creato gli altri publisher:
    pub.speechSay = new ROSLIB.Topic({
        ros,
        name: '/qt_robot/speech/say',
        messageType: 'std_msgs/String',
    });

    // AGGIUNGI ANCHE QUESTA VARIANTE (spesso è quella giusta):
    pub.ttsSay = new ROSLIB.Topic({
        ros,
        name: '/qt_robot/tts/say',
        messageType: 'std_msgs/String',
    });


    // poi modifica sayFast così:
    async function sayFast(text) {
        if (!connected) throw new Error('Non connesso. Chiama QT.init() prima.');
        if (!text || !text.trim()) return;
        const msg = { data: text };

        // pubblica su entrambi i topic più comuni (idempotente lato TTS; se uno non ha subscriber, nessun problema)
        if (pub.speechSay) pub.speechSay.publish(msg);
        if (pub.ttsSay)    pub.ttsSay.publish(msg);

        console.log('[QT] Say (topic fast):', text);
    }

    // esporta anche sayFast
    return { init, configure, say, sayFast, showEmotion };


})();
*/

// qtrobot_utils.js
// Richiede che eventemitter2 e roslib siano già caricati in pagina

const QT = (() => {
    let ros = null;
    let connected = false;
    let connecting = false;

    const svc = {
        setVolume: null,
        speechConfig: null,
        speechSay: null,
        emotionShow: null,
    };

    const pub = {
        speechSay: null,
        ttsSay: null, // variante per alcune installazioni QTrobot
    };

    function assertRoslib() {
        if (!window.ROSLIB) {
            throw new Error('ROSLIB non è disponibile: verifica gli <script> e il loro ordine.');
        }
    }

    function buildHandles() {
        // Costruisci i clients/publishers SOLO quando ros esiste
        if (!ros) throw new Error('buildHandles chiamato senza ros.');

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

        pub.speechSay = new ROSLIB.Topic({
            ros, name: '/qt_robot/speech/say', messageType: 'std_msgs/String',
        });

        // Alcune build ascoltano qui:
        pub.ttsSay = new ROSLIB.Topic({
            ros, name: '/qt_robot/tts/say', messageType: 'std_msgs/String',
        });

        pub.speechSay = new ROSLIB.Topic({
            ros,
            name: '/qt_robot/speech/say',
            messageType: 'std_msgs/String'
        });

        pub.webSay = new ROSLIB.Topic({
            ros,
            name: '/web_say',
            messageType: 'std_msgs/String'
        });


        pub.ttsSay = new ROSLIB.Topic({
            ros,
            name: '/qt_robot/tts/say',
            messageType: 'std_msgs/String'
        });

        // Verifica che tutti abbiano .ros valorizzato
        const bad = [];
        Object.entries({ ...svc, ...pub }).forEach(([k, v]) => {
            if (!v || !v.ros) bad.push(k);
        });
        if (bad.length) {
            console.warn('[QT] Handle(s) con ros=null:', bad);
            throw new Error('Inizializzazione handle incompleta (ros=null).');
        }
    }

    function clearHandles() {
        Object.keys(svc).forEach(k => svc[k] = null);
        Object.keys(pub).forEach(k => pub[k] = null);
    }

    // --- util: chiama un servizio come Promise
    function callService(service, requestObj, { timeoutMs = 8000 } = {}) {
        return new Promise((resolve, reject) => {
            if (!connected || !ros) return reject(new Error('ROS non connesso'));
            if (!service || !service.ros) return reject(new Error('Service non inizializzato (ros=null)'));

            let done = false;
            const t = setTimeout(() => {
                if (!done) { done = true; reject(new Error('Service timeout')); }
            }, timeoutMs);

            service.callService(
                new ROSLIB.ServiceRequest(requestObj),
                (res) => { if (!done) { done = true; clearTimeout(t); resolve(res); } },
                (err) => { if (!done) { done = true; clearTimeout(t); reject(err instanceof Error ? err : new Error(String(err))); } }
            );
        });
    }

    async function init(rosbridgeUrl = 'ws://192.168.100.2:9091') {
        assertRoslib();
        if (connected && ros) return;
        if (connecting) {
            // evita race condition: attendi che il primo init finisca
            await new Promise(r => setTimeout(r, 200));
            if (connected) return;
        }

        connecting = true;
        clearHandles();

        ros = new ROSLIB.Ros({ url: rosbridgeUrl });

        ros.on('connection', () => {
            connected = true;
            console.log('[QT] Connected to', rosbridgeUrl);
        });

        ros.on('close', () => {
            connected = false;
            console.warn('[QT] Connection closed');
            clearHandles();
        });

        ros.on('error', (e) => {
            console.error('[QT] Connection error:', e);
        });

        // attendo connessione (o errore/timeout)
        await new Promise((resolve, reject) => {
            const start = Date.now();
            const maxWait = 8000;
            (function check() {
                if (connected) return resolve();
                if (Date.now() - start > maxWait) return reject(new Error('Connessione a rosbridge scaduta'));
                setTimeout(check, 100);
            })();
        });

        // Costruisci gli handle quando la connessione è attiva
        buildHandles();

        connecting = false;
    }

    // --- configure: volume + lingua
    async function configure({ volume = null, language = null } = {}) {
        if (!connected) throw new Error('Non connesso. Chiama QT.init() prima.');
        if (typeof volume === 'number') {
            const v = Math.max(0, Math.min(100, Math.round(volume)));
            await callService(svc.setVolume, { volume: v });
        }
        if (typeof language === 'string' && language.length > 0) {
            await callService(svc.speechConfig, { language });
        }
    }

    // --- say: service (ACK)
    async function say(text) {
        if (!connected) throw new Error('Non connesso. Chiama QT.init() prima.');
        const msg = (text || '').trim();
        if (!msg) return;
        await callService(svc.speechSay, { message: msg });
    }

    // --- sayFast: publish (fire-and-forget)
    async function sayFast(text) {
        console.log("Ciao")
        if (!connected) throw new Error('Non connesso. Chiama QT.init() prima.');
        const msg = (text || '').trim();
        if (!msg) return;
        const payload = { data: msg };

        // usa il topic bridge
        if (pub.webSay && pub.webSay.ros) {
            pub.webSay.publish(payload);
            //console.log('[QT] sayFast → /web_say');
        } else {
            console.warn('[QT] /web_say non disponibile, fallback al service');
            await say(text); // fallback
        }
    }

    return { init, configure, say, sayFast };
})();
