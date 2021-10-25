const bancoDeDados = require('../bancodedados');
const { format } = require('date-fns');

function verificarNumeroConta(dados) {
    if (!dados.numero_conta) {
        return 'Insira o número da conta.';
    }
}

function saldoNaoInformado(dados) {
    if (!Number(dados.valor) || Number(dados.valor) <= 0) {
        return 'Insira um valor válido para realizar a operação.';
    }
}

function verificarSenha(dados) {
    if (!dados.senha) {
        return 'Insira a senha.';
    }
}

function registroDeOperacao(req) {
    const date = new Date();
    const dataFormatada = format(date, "yyyy-MM-dd HH:mm:ss");

    const novaOperacao = {
        data: dataFormatada,
        numero_conta: req.body.numero_conta,
        valor: req.body.valor
    }
    return novaOperacao;
}

function autenticarSenha(dados, conta) {
    if (dados.senha != conta.usuario.senha) {
        return 'Senha inválida.';
    }
}
function verificarSaldo(dados, conta) {
    if (dados.valor > conta.saldo) {
        return 'Valor indisponível.';
    }
}

async function depositar(req, res) {
    const conta = bancoDeDados.contas.find(conta => conta.numero === req.body.numero_conta);

    const erroContaNaoInformada = verificarNumeroConta(req.body);
    const erroSaldoNaoInformado = saldoNaoInformado(req.body);

    if (erroContaNaoInformada) {
        res.status(400).json({ erro: erroContaNaoInformada });
        return;
    }
    if (erroSaldoNaoInformado) {
        res.status(400).json({ erro: erroSaldoNaoInformado });
        return;
    }
    if (!conta) {
        res.status(404).json({ erro: "Conta não localizada." });
        return;
    }
    conta.saldo += req.body.valor;
    res.status(200).json({ mensagem: "Depósito realizado com sucesso!" });

    bancoDeDados.depositos.push(registroDeOperacao(req));
}

async function sacar(req, res) {
    const conta = bancoDeDados.contas.find(conta => conta.numero === req.body.numero_conta);

    const erroSemSenha = verificarSenha(req.body);
    const erroContaNaoInformada = verificarNumeroConta(req.body);
    const erroSaldoNaoInformado = saldoNaoInformado(req.body);

    if (erroSemSenha) {
        res.status(400).json({ erro: erroSemSenha });
        return;
    }
    if (erroContaNaoInformada) {
        res.status(400).json({ erro: erroContaNaoInformada });
        return;
    }
    if (erroSaldoNaoInformado) {
        res.status(400).json({ erro: erroSaldoNaoInformado });
        return;
    }
    if (!conta) {
        res.status(404).json({ erro: 'Conta não localizada.' });
        return;
    }
    const erroSenhaInvalida = autenticarSenha(req.body, conta);
    const erroSaldoInvalido = verificarSaldo(req.body, conta);
    if (erroSenhaInvalida) {
        res.status(400).json({ erro: erroSenhaInvalida });
        return;
    }
    if (erroSaldoInvalido) {
        res.status(400).json({ erro: erroSaldoInvalido });
        return;
    }
    conta.saldo -= req.body.valor;
    res.status(200).json({ mensagem: 'Saque realizado com sucesso!' });

    bancoDeDados.saques.push(registroDeOperacao(req));
}

async function transferir(req, res) {
    const conta = bancoDeDados.contas.find(conta => conta.numero === req.body.numero_conta_origem);
    const contaDestino = bancoDeDados.contas.find(contaDestino => contaDestino.numero === req.body.numero_conta_destino);

    if (!conta) {
        res.status(404).json({ erro: 'Conta de origem não localizada.' });
        return;
    }
    if (!contaDestino) {
        res.status(404).json({ erro: 'Conta de destino não localizada.' });
        return;
    }

    const erroSemSenha = verificarSenha(req.body);
    const erroSenhaInvalida = autenticarSenha(req.body, conta);
    const erroSaldoInvalido = verificarSaldo(req.body, conta);
    const erroSaldoNaoInformado = saldoNaoInformado(req.body);

    if (erroSemSenha) {
        res.status(400).json({ erro: erroSemSenha });
        return;
    }
    if (erroSenhaInvalida) {
        res.status(400).json({ erro: erroSenhaInvalida });
        return;
    }
    if (erroSaldoInvalido) {
        res.status(400).json({ erro: erroSaldoInvalido });
        return;
    }
    if (erroSaldoNaoInformado) {
        res.status(400).json({ erro: erroSaldoNaoInformado });
        return;
    }
    if (!req.body.numero_conta_origem) {
        res.status(400).json({ erro: 'Insira a conta de origem.' });
        return;
    }
    if (!req.body.numero_conta_destino) {
        res.status(400).json({ erro: 'Insira a conta de destino.' });
        return;
    }
    conta.saldo -= req.body.valor;
    contaDestino.saldo += req.body.valor;

    const date = new Date();
    const dataFormatada = format(date, "yyyy-MM-dd HH:mm:ss");
    const novaTransferencia = {
        data: dataFormatada,
        numero_conta_origem: req.body.numero_conta_origem,
        numero_conta_destino: req.body.numero_conta_destino,
        valor: req.body.valor
    }
    bancoDeDados.transferencias.push(novaTransferencia);
    res.status(200).json({ mensagem: "Transferência realizada com sucesso!" });
}

function semContaQuery(dados) {
    if (!dados.numero_conta) {
        return 'Insira a conta.';
    }
}

function semSenhaQuery(dados) {
    if (!dados.senha) {
        return 'Insira a senha.';
    }
}

function senhaQueryInvalida(dados, senhaConta) {
    if (senhaConta !== dados.senha) {
        return 'Senha inválida!';
    }
}

async function saldo(req, res) {
    const erroSemContaQuery = semContaQuery(req.query);
    const erroSemSenhaQuery = semSenhaQuery(req.query);

    if (erroSemContaQuery) {
        res.status(400).json({ erro: erroSemContaQuery });
        return;
    }

    if (erroSemSenhaQuery) {
        res.status(400).json({ erro: erroSemSenhaQuery });
        return;
    }

    const conta = bancoDeDados.contas.find(conta => conta.numero === req.query.numero_conta);

    if (!conta) {
        res.status(404).json({ erro: 'Conta não localizada.' });
        return;
    }

    const erroSenhaQueryInvalida = senhaQueryInvalida(req.query, conta.usuario.senha);

    if (erroSenhaQueryInvalida) {
        res.status(400).json({ erro: erroSenhaQueryInvalida });
        return;
    }
    res.status(200).json({ saldo: conta.saldo });
}

async function extrato(req, res) {
    const erroSemContaQuery = semContaQuery(req.query);
    const erroSemSenhaQuery = semSenhaQuery(req.query);

    if (erroSemContaQuery) {
        res.status(400).json({ erro: erroSemContaQuery });
        return;
    }

    if (erroSemSenhaQuery) {
        res.status(400).json({ erro: erroSemSenhaQuery });
        return;
    }

    const conta = bancoDeDados.contas.find(conta => conta.numero === req.query.numero_conta);

    if (!conta) {
        res.status(404).json({ erro: 'Conta não localizada.' });
        return;
    }

    const erroSenhaQueryInvalida = senhaQueryInvalida(req.query, conta.usuario.senha);

    if (erroSenhaQueryInvalida) {
        res.status(400).json({ erro: erroSenhaQueryInvalida });
        return;
    }
    const depositos = bancoDeDados.depositos.filter(x => x.numero_conta === conta.numero);
    const saques = bancoDeDados.saques.filter(x => x.numero_conta === conta.numero);
    const transferenciasEnviadas = bancoDeDados.transferencias.filter(x => x.numero_conta_origem === conta.numero);
    const transferenciasRecebidas = bancoDeDados.transferencias.filter(x => x.numero_conta_destino === conta.numero);
    res.status(200).json({ depositos, saques, transferenciasEnviadas, transferenciasRecebidas });
}

module.exports = { depositar, sacar, transferir, saldo, extrato }