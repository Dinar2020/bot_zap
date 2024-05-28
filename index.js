// import puppeteer from 'puppeteer';

// async function monitorZapForGroups(groupName) {
//     try {
//         const browser = await puppeteer.launch({
//             executablePath: '/snap/bin/chromium',
//             headless: false,
//             defaultViewport: false,
//             userDataDir: "./tmp",
//             args: ['--no-sandbox', '--disable-setuid-sandbox']
//         });
//         let pages = await browser.pages();

//         // Fecha todas as abas about:blank
//         for (let i = 1; i < pages.length; i++) {
//             const pageUrl = pages[i].url();
//             if (pageUrl === 'about:blank') {
//                 await pages[i].close();
//             }
//         }

//         // Atualiza a lista de páginas depois de fechar as abas about:blank
//         pages = await browser.pages();

//         // Se não houver apenas uma aba aberta, abrimos uma nova aba
//         let page = pages.length === 0 ? await browser.newPage() : pages[0];
//         await page.goto('https://web.whatsapp.com');

//         // Aguarde até que a interface do usuário do WhatsApp Web esteja carregada
//         await page.waitForSelector(`[title='${groupName}']`, { timeout: 40000 });

//         // Localize o grupo pelo título e clique nele
//         await page.click(`[title='${groupName}']`);

//         // Espera adicional para a conversa do grupo carregar após o clique
//         await new Promise(resolve => setTimeout(resolve, 7000));

//         const chatHeaderSelector = '._amif'; // Este seletor precisa ser validado
//         const headerName = await page.evaluate((selector) => {
//             const headerElement = document.querySelector(selector);
//             return headerElement ? headerElement.innerText : null;
//         }, chatHeaderSelector);

//         // Verifique se o nome do cabeçalho é o nome do grupo esperado e log no console
//         if (headerName.includes(groupName)) { // Verifica se o nome do cabeçalho contém o nome do grupo
//             console.log(`Confirmado: O bot está no grupo '${groupName}'.`);
//         } else {
//             console.log(`Erro: O bot não está no grupo esperado. Nome atual do cabeçalho: '${headerName}'.`);
//         }

//         let lastProcessedIndex = 0;

//         while (true) {
//             // Rola a conversa até o topo antes de verificar mensagens
            


//             // Espera um tempo adicional antes de verificar as mensagens
//             await new Promise(resolve => setTimeout(resolve, 3000));

//             // Localiza mensagens de convite de grupo usando o seletor que combina classes parciais
//             const groupInviteMessages = await page.$$('[class*="_amkz"][class*="message"]');

//             for (let i = lastProcessedIndex; i < groupInviteMessages.length; i++) {
//                 const inviteMessage = groupInviteMessages[i];
//                 const joinButton = await inviteMessage.$('button[title="Join group"]');
//                 if (joinButton) {
//                     try {
//                         // Verifique se o botão está conectado ao documento e é visível
//                         const isConnected = await joinButton.evaluate(node => node.isConnected);
//                         if (isConnected) {
//                             await joinButton.evaluate(node => node.scrollIntoViewIfNeeded());
//                             await joinButton.click();
//                             console.log('Clique no botão "Join group" realizado com sucesso.');

//                             // Espera a janela de confirmação aparecer
//                             await page.waitForSelector('div[role="dialog"]', { timeout: 5000 }).catch(() => null);

//                             // Verifica se a mensagem de erro de link expirado está presente
//                             const errorMessagePresent = await page.evaluate(() => {
//                                 const errorMessage = document.querySelector('div[role="dialog"] div');
//                                 return errorMessage && errorMessage.innerText.includes("You can't join this group because this invite link was reset.");
//                             });

//                             if (errorMessagePresent) {
//                                 // Clica no botão "Cancelar" específico dentro do diálogo
//                                 const cancelButton = await page.$('div[role="dialog"] button');
//                                 if (cancelButton) {
//                                     await cancelButton.click();
//                                     console.log('Link expirado ou inválido. Pulando para o próximo...');
//                                 }
//                             } else {
//                                 console.log('Link válido. Tentando confirmar a entrada no grupo...');

//                                 // Clica no novo botão "Join group" que aparece no modal
//                                 const buttons = await page.$$('div[role="dialog"] button');
//                                 for (const button of buttons) {
//                                     const buttonText = await button.evaluate(node => node.textContent);
//                                     if (buttonText === 'Join group') {
//                                         await button.click();
//                                         console.log('Clique no botão "Join group" dentro do modal realizado com sucesso.');
//                                         break; // Sai do loop após encontrar o botão correto
//                                     }
//                                 }

//                                 // Volta ao grupo de origem
//                                 await new Promise(resolve => setTimeout(resolve, 5000));
//                                 await page.click(`[title='${groupName}']`);
//                                 await new Promise(resolve => setTimeout(resolve, 5000)); // Aguarda a página carregar

//                                 // Rola a conversa até o topo novamente após voltar ao grupo de origem
//                                 // await page.evaluate(() => {
//                                 //     const chatContainer = document.querySelector('._ajyl');
//                                 //     if (chatContainer) {
//                                 //         chatContainer.scrollTop = 0;
//                                 //     }
//                                 // });
//                             }
//                         } else {
//                             console.log('Botão "Join group" não está conectado ao documento. Pulando para o próximo...');
//                         }
//                     } catch (error) {
//                         console.error('Erro ao tentar clicar no botão "Join group":', error);
//                     }

//                     lastProcessedIndex = i + 1;
//                 }
//             }

//             // Aguardar algum tempo antes de verificar novamente
//             await new Promise(resolve => setTimeout(resolve, 5000));
//         }
//     } catch (error) {
//         console.error('Erro durante o monitoramento de links de grupos:', error);
//     }
// }

// monitorZapForGroups('monitor zap');


// TESTE

import puppeteer from 'puppeteer';

async function monitorZapForGroups(groupName) {
    try {
        const browser = await puppeteer.launch({
            executablePath: '/snap/bin/chromium',
            headless: false,
            defaultViewport: false,
            userDataDir: "./tmp",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        let pages = await browser.pages();

        // Fecha todas as abas about:blank
        for (let i = 1; i < pages.length; i++) {
            const pageUrl = pages[i].url();
            if (pageUrl === 'about:blank') {
                await pages[i].close();
            }
        }

        // Atualiza a lista de páginas depois de fechar as abas about:blank
        pages = await browser.pages();

        // Se não houver apenas uma aba aberta, abrimos uma nova aba
        let page = pages.length === 0 ? await browser.newPage() : pages[0];
        await page.goto('https://web.whatsapp.com');

        // Aguarde até que a interface do usuário do WhatsApp Web esteja carregada
        await page.waitForSelector(`[title='${groupName}']`, { timeout: 40000 });

        // Localize o grupo pelo título e clique nele
        await page.click(`[title='${groupName}']`);

        // Espera adicional para a conversa do grupo carregar após o clique
        await new Promise(resolve => setTimeout(resolve, 7000));

        const chatHeaderSelector = '._amif'; // Este seletor precisa ser validado
        const headerName = await page.evaluate((selector) => {
            const headerElement = document.querySelector(selector);
            return headerElement ? headerElement.innerText : null;
        }, chatHeaderSelector);

        // Verifique se o nome do cabeçalho é o nome do grupo esperado e log no console
        if (headerName.includes(groupName)) { // Verifica se o nome do cabeçalho contém o nome do grupo
            console.log(`Confirmado: O bot está no grupo '${groupName}'.`);
        } else {
            console.log(`Erro: O bot não está no grupo esperado. Nome atual do cabeçalho: '${headerName}'.`);
        }

        let lastProcessedIndex = 0;

        while (true) {

            // Clica no botão "Read more" até que ele não esteja mais presente
            let readMoreButton;
            while ((readMoreButton = await page.$('div[role="button"].read-more-button')) !== null) {
                await readMoreButton.click();
                await new Promise(resolve => setTimeout(resolve, 1000)); // Espera um pouco para carregar mais links
            }

            
            // Rola a conversa até o topo antes de verificar mensagens
            await page.evaluate(() => {
                const chatContainer = document.querySelector('._akbu');
                if (chatContainer) {
                    chatContainer.scrollTop = 0;
                }
            });
    
            // Espera um tempo adicional antes de verificar as mensagens
            await new Promise(resolve => setTimeout(resolve, 3000));
    
            // Localiza mensagens de convite de grupo usando o seletor que combina classes parciais
            const groupInviteMessages = await page.$$('[class*="_amkz"][class*="message"]');
    
            for (let i = lastProcessedIndex; i < groupInviteMessages.length; i++) {
                const inviteMessage = groupInviteMessages[i];
                const linkElements = await inviteMessage.$$('a[class^="_ao3e"]');
                for (const linkElement of linkElements) {
                    const link = await linkElement.evaluate(e => e.getAttribute('href'));
                    console.log('Link do grupo:', link);
    
                    await linkElement.click();
                    console.log('Clique no link do grupo realizado com sucesso.');
    
                    // Aguarda um tempo para a página de convite ser carregada
                    await new Promise(resolve => setTimeout(resolve, 5000));
    
                    // Verifica se há um botão "Join group" ou "Request to join"
                    const joinButton = await page.$('button[title="Join group"], button[title="Request to join"]');
                    if (joinButton) {
                        await joinButton.click();
                        console.log('Clique no botão "Join group" ou "Request to join" realizado com sucesso.');
    
                        // Aguarda um tempo para o botão ser clicado e a entrada no grupo ser processada
                        await new Promise(resolve => setTimeout(resolve, 5000));
    
                        // Retorna ao grupo de origem
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        await page.click(`[title='${groupName}']`);
                        await new Promise(resolve => setTimeout(resolve, 5000)); // Aguarda a página carregar
                    } else {
                        console.log('Botão "Join group" não encontrado. Pulando para o próximo...');
                    }
                }
    
                lastProcessedIndex = i + 1;
            }
    
            // Aguardar um tempo adicional antes de verificar novamente
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
    catch (error) {
        console.error('Erro durante o monitoramento de links de grupos:', error);
    }
}

monitorZapForGroups('monitor zap');