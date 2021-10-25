const bancoDeDados = require('../bancodedados');

async function listarContas(req, res) {
    if (!req.query.senha_banco) {
        res.status(400).json({ mensagem: 'Insira a senha do banco.' });
        return;
    }
    else if (req.query.senha_banco !== bancoDeDados.banco.senha) {
        res.status(400).json({ mensagem: 'Senha do banco inválida.' });
        return;
    }
    else {
        res.status(200).json(bancoDeDados.contas);
    }
}

let numero = 1;
let saldo = 0;

function identificarDadosUnicos(dados) {
    const dadosExistentes = bancoDeDados.contas.find(x => x.usuario.cpf === dados || x.usuario.email === dados);
    if (dadosExistentes) {
        return true;
    }
    else {
        return false;
    }
}

function verificarDados(dados) {
    if (identificarDadosUnicos(dados.cpf)) {
        return 'Já existe uma conta com o CPF informado.';
    }
    if (identificarDadosUnicos(dados.email)) {
        return 'Já existe uma conta com o e-mail informado.';
    }
}

async function criarConta(req, res) {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        res.status(400).json({ erro: 'Insira todos os campos: nome, cpf, data de nascimento, telefone, email e senha.' });
        return;
    }
    const erro = verificarDados(req.body);

    if (erro) {
        res.status(400).json({ erro });
        return;
    }

    const novaConta = {
        numero: (Number(numero).toString()),
        saldo,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha,
        }
    }
    bancoDeDados.contas.push(novaConta);
    numero++;
    res.status(201).json(novaConta);
}

async function atualizarUsuarioConta(req, res) {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (nome || cpf || data_nascimento || telefone || email || senha) {

        const conta = bancoDeDados.contas.find(conta => conta.numero === req.params.numeroConta);
        if (!conta) {
            res.status(400).json({ erro: 'Conta não encontrada.' });
            return;
        }
        const erro = verificarDados(req.body);

        if (erro) {
            res.status(400).json({ erro })
            return;
        }
        if (!!nome) {
            conta.usuario.nome = nome;
        }
        if (!!cpf) {
            conta.usuario.cpf = cpf;
        }
        if (!!data_nascimento) {
            conta.usuario.data_nascimento = data_nascimento;
        }
        if (!!telefone) {
            conta.usuario.telefone = telefone;
        }
        if (!!email) {
            conta.usuario.email = email;
        }
        if (!!senha) {
            conta.usuario.senha = senha;
        }
        res.status(200).json({ mensagem: "Conta atualizada com sucesso!" });
        return;
    }
    else {
        res.status(400).json({ erro: "Você precisa inserir um campo para alteração." });
    }
}

async function excluirConta(req, res) {
    const conta = bancoDeDados.contas.find(conta => conta.numero === req.params.numeroConta);
    const indice = bancoDeDados.contas.indexOf(conta);

    if (!conta) {
        res.status(404).json({ erro: "Conta não localizada." });
        return;
    }
    if (conta.saldo > 0) {
        res.status(400).json({ erro: "Não é possível excluir uma conta com saldo." });
        return;
    }
    bancoDeDados.contas.splice(indice, 1);
    res.status(200).json({ mensagem: "Conta excluída com sucesso!" });
}


module.exports = { listarContas, criarConta, atualizarUsuarioConta, excluirConta }