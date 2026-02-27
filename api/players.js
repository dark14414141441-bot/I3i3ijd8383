const players = {};

export default function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE");
    res.setHeader("Content-Type", "application/json");

    // Registrar jogador (Normal chama isso)
    if (req.method === "POST") {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: "name required" });
        players[name] = Date.now();
        return res.status(200).json({ ok: true });
    }

    // Listar jogadores (ADM chama isso)
    if (req.method === "GET") {
        // Remove jogadores inativos há mais de 30 segundos
        const now = Date.now();
        for (const name in players) {
            if (now - players[name] > 30000) delete players[name];
        }
        return res.status(200).json({ players: Object.keys(players) });
    }

    // Remover jogador
    if (req.method === "DELETE") {
        const { name } = req.body;
        if (name && players[name]) delete players[name];
        return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "method not allowed" });
}
