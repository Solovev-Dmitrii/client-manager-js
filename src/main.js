


(() => {



    const onClose = (element) => {
        element.classList.add('close-animation')
        document.body.style.pointerEvents = 'none'
        timeoutID = setTimeout(() => (element.remove(), document.body.classList.remove('scroll-prohibited'), document.body.style.pointerEvents = 'auto'), 500)

    },
        showBtnLoadung = () => {
            const btn = document.querySelector('.form__save'),
                loading = document.createElement('div')
            loading.classList.add('btn-loading')
            loading.id = 'loading'
            btn.append(loading)
            Array.from(document.getElementsByTagName("input")).forEach((input) => input.setAttribute('disabled', 'disabled'))

        },

        showTableLoading = () => {
            const loading = document.createElement('div'),
                spinner = document.createElement('div')
            loading.classList.add('loading')
            spinner.classList.add('spinner')
            loading.append(spinner)
            return loading
        },
        createErrorLine = (text) => {
            const errorLine = document.createElement('span')
            errorLine.classList.add('error__line')
            errorLine.textContent = text
            return errorLine
        },

        showErrorText = ({ element, errorElement }, data, status) => {
            const deleteError = () => !!errorElement.children.length > 0 ? document.querySelectorAll('.error__line').forEach(child => child.remove()) : 1,
                contactInputs = Array.from(element.querySelectorAll('.contact__input')),
                requeredNameInputs = Array.from(element.querySelectorAll('.form__input')).slice(0, 2),
                classArray = (item) => Array.from(item.classList),
                idListOfClients = JSON.parse(localStorage.getItem('idListOfClients'))
            !!data.id && !idListOfClients.includes(data.id) ? idListOfClients.unshift(data.id) : 1

            requeredNameInputs.reduce((array, item) => [...array, item], contactInputs).forEach(input => input.value.trim().length > 0 || classArray(input).includes('input-error') ? 1 : input.classList.add('input-error'))

            status === 422 ? (deleteError(), data.errors.forEach(text => errorElement.append(createErrorLine(text.message)))) : status === 404 || String(status).split('')[0] === '5' ? (deleteError(), errorElement.append(createErrorLine(data.message))) : !data ? (deleteError(), errorElement.append(createErrorLine('Что-то пошло не так...'))) : (onClose(element), localStorage.setItem('idListOfClients', JSON.stringify(idListOfClients)))
            document.getElementById('loading').remove()
            Array.from(document.getElementsByTagName("input")).forEach((input) => input.removeAttribute('disabled', 'disabled'))
        },

        onSave = async ({ formData, element, errorElement }) => {
            showBtnLoadung()
            const response = await fetch('http://localhost:3000/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            }),
                data = await response.json()
            showErrorText({ element, errorElement }, data, response.status)
            document.body.classList.remove('scroll-prohibited')
            location.reload()
        },

        onChange = async ({ formData, element, errorElement }, id) => {
            showBtnLoadung()
            const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    surname: formData.surname,
                    name: formData.name,
                    lastName: formData.lastName,
                    contacts: formData.contacts,
                })
            })
            data = await response.json()
            showErrorText({ element, errorElement }, data, response.status)
            document.body.classList.remove('scroll-prohibited')
            location.reload()

        },

        onDelete = async ({ id, element, errorElement }) => {

            showBtnLoadung()
            const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
                method: 'DELETE',
            }),
                data = await response.json(),
                idListOfClients = JSON.parse(localStorage.getItem('idListOfClients')),
                index = idListOfClients.indexOf(idListOfClients.find(clientId => clientId == id))
            idListOfClients.splice(index, 1)

            showErrorText({ element, errorElement }, data, response.status)
            document.body.classList.remove('scroll-prohibited')
            localStorage.setItem('idListOfClients', JSON.stringify(idListOfClients))
            location.reload()

        },

        getContactList = async () => {
            const response = await fetch(`http://localhost:3000/api/clients`);
            const data = await response.json();
            return data;
        },

        functionBox = { onSave, onClose, onChange, onDelete },

        addErrorClass = ({ element }) => {
            element.addEventListener('input', () => {
                const classList = Array.from(element.classList)
                element.value.trim().length > 0 ? classList.forEach((style, index) => style === 'input-error' ? element.classList.remove('input-error') : 1) : classList.includes('input-error') ? 1 : element.classList.add('input-error')
            })
        },

        createSearch = () => {
            const search = document.createElement('div'),
                container = document.createElement('div'),
                logo = document.createElement('a'),
                input = document.createElement('input'),
                emptyError = document.createElement('span'),
                adviceList = document.createElement('div')
            container.classList.add('container')
            search.classList.add('search')
            logo.classList.add('search__logo')
            input.classList.add('search__input')
            emptyError.classList.add('search__empty-error')
            adviceList.classList.add('search__advice-list', 'advice-list')
            input.placeholder = 'Введите запрос'
            logo.setAttribute('href', 'index.html')
            container.append(logo, input, emptyError, adviceList)
            search.append(container)
            return search
        },
        focusModal = () => !!document.querySelector('.modal__form') ? document.querySelector('.modal__form').focus() : '',
        changeHighModal = () => {
            const modal = document.querySelector('.modal'),
                form = document.querySelector('.modal__form')


            form.clientHeight > window.screen.height ? modal.style.alignItems = 'start' : modal.style.alignItems = 'center'



        },

        createModal = (obj, { onSave, onClose, onChange, onDelete }, btnIndicator, usedBtn) => {
            bodyWidth = document.body.clientWidth
            const modal = document.createElement('div'),
                closeBack = document.createElement('button'),
                form = document.createElement('form'),
                title = document.createElement('h3'),
                top = document.createElement('div'),
                middle = document.createElement('div'),
                bottom = document.createElement('div'),
                surname = { input: document.createElement('input'), placeholder: "Фамилия" },
                name = { input: document.createElement('input'), placeholder: "Имя" },
                lastName = { input: document.createElement('input'), placeholder: "Отчество" },
                add = document.createElement('button'),
                textBtn = document.createElement('span'),
                save = document.createElement('button'),
                cancel = document.createElement('button'),
                close = document.createElement('button'),
                id = document.createElement('span'),
                inputDataArray = [surname, name, lastName],
                closeArray = [close, cancel],
                confirmText = document.createElement('p'),
                errorText = document.createElement('div'),
                container = document.querySelector('.container')


            modal.classList.add("modal")
            closeBack.classList.add("modal__back")
            form.classList.add("modal__form", "form")
            top.classList.add('form__top')
            middle.classList.add('form__middle')
            bottom.classList.add('form__bottom')
            title.classList.add("form__title")
            add.classList.add("form__add")
            textBtn.classList.add('form__add-text')
            save.classList.add("form__save")
            cancel.classList.add("form__cancel")
            close.classList.add("form__close")
            id.classList.add("form__id")
            confirmText.classList.add("form__confirm")
            errorText.classList.add('form__error')
            document.body.classList.add('scroll-prohibited')

            title.textContent = 'Новый клиент'
            textBtn.textContent = 'Добавить контакт'
            save.textContent = 'Сохранить'
            cancel.textContent = 'Отмена'
            id.textContent = `ID: ${obj.id}`
            confirmText.textContent = 'Вы действительно хотите удалить данного клиента?'
            form.setAttribute('tabindex', '0')



            inputDataArray.forEach((item, index) => {
                const label = document.createElement('label'),
                    star = document.createElement('span'),
                    heading = document.createElement('span'),
                    copy = document.createElement('button')

                label.classList.add('form__label'),
                    item.input.classList.add('form__input'),
                    heading.classList.add('form__input-heading')
                star.classList.add('star')
                copy.classList.add('copy-btn')
                star.id = `star-${index + 1}`
                star.textContent = '*'
                index < 2 ? (label.append(star, item.input), addErrorClass({ element: item.input })) : label.append(item.input);
                top.append(label)
                btnIndicator === 0 ? (item.input.placeholder = item.placeholder, item.input.addEventListener('input', () => !item.input.value == '' ? star.remove() : label.prepend(star))) : (heading.textContent = item.placeholder, label.prepend(heading), star.id = `add-changes-star-${index + 1}`)
                if (btnIndicator === 4) {
                    copy.classList.add('copy')
                    label.append(copy)
                    copy.onclick = (e) => (e.preventDefault(), item.input.select(), document.execCommand("copy"))
                }
            })
            add.append(textBtn)
            middle.append(add)

            const createContact = (contactData) => {
                const contact = document.createElement('div'),
                    type = document.createElement('button'),
                    input = document.createElement('input'),
                    close = document.createElement('button'),
                    arrow = document.createElement('span'),
                    vk = document.createElement('button'),
                    facebook = document.createElement('button'),
                    another = document.createElement('button'),
                    email = document.createElement('button'),
                    surPhone = document.createElement('button'),
                    typeList = document.createElement('div'),
                    inputAnother = document.createElement('input'),
                    createInput = (choicesArray) => {
                        type.textContent = ""
                        type.classList.add('arrow-only')
                        !!choicesArray ? inputAnother.value = '' : inputAnother.value = contactData.type
                        contact.prepend(inputAnother)
                    }
                contact.classList.add('contact')
                type.classList.add('contact__type')
                input.classList.add('contact__input')
                close.classList.add('contact__close')
                arrow.classList.add('contact__arrow')
                typeList.classList.add('contact__choices-list')
                inputAnother.classList.add('contact__another-input')
                inputAnother.placeholder = `Тип контакта`
                let typeArray = [type, surPhone, email, vk, facebook, another],
                    textBtnArray = ['Телефон', 'Доп. телефон', 'Email', 'Vk', 'Facebook', 'Другое'],
                    textUsage = textBtnArray.slice(0, 5)
                contact.append(type, arrow, input, close, typeList)
                add.before(contact)
                !!contactData ? (textBtnArray[0] = contactData.type, input.value = contactData.value) : 1
                textBtnArray.slice(1, 5).forEach((text, i) => {
                    text === textBtnArray[0] && textBtnArray[0] !== 'Телефон' ? textBtnArray[i + 1] = 'Телефон' : 1
                })
                typeArray.forEach((btn, i) => btn.textContent = textBtnArray[i])
                !!contactData ? textUsage.filter(text => text === contactData.type).length === 0 ? (createInput(), another.textContent = 'Телефон') : 1 : 1

                typeArray.slice(1).forEach(btn => (typeList.append(btn), btn.classList.add('choice-btn')))
                typeArray.forEach(btn => btn.addEventListener('click', (e) => {
                    e.preventDefault()
                    typeList.classList.toggle('open-choices')
                    const text = btn.textContent
                    arrow.classList.toggle('arrow-top')
                    btn.parentElement == typeList && contact.firstElementChild == inputAnother ? (inputAnother.remove(), type.classList.remove('arrow-only'), btn.textContent = "Другое", type.textContent = text) : btn.parentElement == typeList ? (btn.textContent = type.textContent, type.textContent = text) : 1
                    type.textContent === 'Другое' ? createInput(typeArray) : 1
                })
                )
                middle.children.length > 10 ? add.remove() : 1

                addErrorClass({ element: input })
                if (btnIndicator === 4) {
                    arrow.remove()
                    add.remove()
                    typeList.remove()
                    createInput()
                    inputAnother.value = contactData.type
                    type.classList.add('copy')
                    close.classList.add('copy')
                    type.onclick = () => {
                        inputAnother.select()
                        document.execCommand("copy");
                    }
                    close.onclick = (e) => {
                        e.preventDefault()
                        input.select()
                        document.execCommand("copy");
                    }
                } else {
                    close.addEventListener('click', () => {
                        contact.remove()
                        middle.append(add)
                    })
                }
            }
            btnIndicator === 1 || btnIndicator === 4 ? obj.contacts.forEach(contact => createContact(contact)) : 1
            add.addEventListener('click', (e) => {
                e.preventDefault()
                createContact()
            })
            let clickCount = 0;
            form.addEventListener('click', () => {
                clickCount > 0 ? document.querySelectorAll('.open-choices').forEach(list => {
                    list.classList.toggle('open-choices')
                    !!list.parentElement.querySelector('.contact__arrow') ? list.parentElement.querySelector('.contact__arrow').classList.toggle('arrow-top') : 1
                }) : 1

                document.querySelectorAll('.open-choices').length > 0 ? clickCount++ : clickCount = 0
            })
            save.addEventListener('click', async (e) => {
                e.preventDefault()
                const contacts = Array.from(form.querySelectorAll('.contact')).reduce((array, contact) => {
                    let key;
                    contact.firstElementChild == contact.querySelector('.contact__type') ? key = contact.firstElementChild.textContent : key = contact.firstElementChild.value
                    const value = contact.children[contact.children.length - 3].value,
                        obj = {
                            type: key,
                            value: value
                        }
                    return [...array, obj]
                }, [])
                const formData = {
                    name: `${name.input.value}`,
                    surname: `${surname.input.value}`,
                    lastName: `${lastName.input.value}`,
                    contacts: contacts
                }
                btnIndicator === 0 ? onSave({ formData, element: modal, errorElement: errorText }) : btnIndicator === 1 ? onChange({ formData, element: modal, errorElement: errorText }, obj.id) : onDelete({ id: obj.id, element: modal, errorElement: errorText })
            })
            closeArray.forEach(btn => btn.addEventListener('click', (e) => (e.preventDefault(), onClose(modal), usedBtn.focus())))
            close.addEventListener('keydown', (e) => e.key === 'Tab' ? focusModal() : 1)
            bottom.append(errorText, save, cancel)
            form.append(title, top, middle, bottom, close)
            modal.append(form, closeBack)

            btnIndicator === 1 || btnIndicator === 4 ? (modal.classList.add('change-modal'), surname.input.value = obj.surname, name.input.value = obj.name, lastName.input.value = obj.lastName, title.after(id), title.textContent = 'Изменить данные', cancel.textContent = 'Удалить клиента') : btnIndicator === 2 || btnIndicator === 3 ? (modal.classList.add('delete'), top.remove(), middle.remove(), id.remove(), title.after(confirmText), title.textContent = 'Удалить клиента', save.textContent = 'Удалить') : 1

            btnIndicator === 1 ? cancel.addEventListener('click', () => timeoutID = setTimeout(() => (container.append(createModal(obj, functionBox, 3, cancel)), focusModal()), 100)) : 1
            btnIndicator === 3 ? closeArray.forEach(btn => btn.addEventListener('click', () => timeoutID = setTimeout(() => (container.append(createModal(obj, functionBox, 1, btn)), focusModal()), 100))) : 1
            closeBack.addEventListener('click', () => onClose(modal))

            btnIndicator === 4 ? (cancel.remove(), save.remove(), title.textContent = 'Данные клиента', [close, closeBack].forEach(item => item.addEventListener('click', () => timeoutID = setTimeout(() => (location = String(location).split('#')[0]), 300)))) : 1

            modal.classList.add('open-animation')
            document.body.style.pointerEvents = 'none'
            const removeOpenAnimation = () => (modal.classList.remove('open-animation'), document.body.style.pointerEvents = 'auto')

            timeoutID = setTimeout(removeOpenAnimation, 500)

            return modal
        },
        transformTimeFormat = (date) => [date.slice(0, 10).split('-').reverse().join('.'), [Number(date.slice(11, 13)) + 3, date.slice(14, 16)].join(':')],

        createTableBody = (list) => {
            idListOfClients = list.reduce((array, client) => [...array, client.id], [])
            localStorage.setItem('idListOfClients', JSON.stringify(idListOfClients))
            const tableBody = document.createElement('tbody'),
                container = document.getElementById('container')
            tableBody.classList.add('table__body')
            list.forEach(client => {
                const tableRow = document.createElement('tr'),
                    contactTypeArray = ['Телефон', 'Доп. телефон', 'Email', 'Vk', 'Facebook'],
                    row = {
                        id: client.id,
                        name: [client.surname, client.name, client.lastName].join(' '),
                        create: transformTimeFormat(client.createdAt),
                        change: transformTimeFormat(client.updatedAt),
                        contacts: client.contacts,
                        doing: ['Изменить', 'Удалить']
                    }

                tableRow.classList.add('table__row')
                tableRow.setAttribute('tabindex', '0')
                Object.entries(row).forEach(([key, value], index) => {
                    const cell = document.createElement('td'),
                        cellBody = document.createElement('div'),

                        createContactIcon = (contact) => {
                            const contactBody = document.createElement('div'),
                                icon = document.createElement('span'),
                                tooltip = document.createElement('div'),
                                typeText = document.createElement('span'),
                                valueText = document.createElement('span'),
                                valueLink = document.createElement('a'),
                                openTooltip = () => (tooltip.classList.add('visible', 'openning'), timeoutID = setTimeout(() => tooltip.classList.remove('openning'), 200), contactBody.classList.add('hover')),
                                closeTooltip = (timeHover) => (timeout = timeHover > 300 ? 200 : 0, tooltip.classList.add('closing'), contactBody.classList.add('mouseout'), timeoutId = setTimeout(() => (tooltip.classList.remove('visible', 'closing'), contactBody.classList.remove('hover', 'mouseout')), timeout))

                            contactTypeArray.every(type => contact.type !== type) ? icon.classList.add(`another-contact-icon`) : (['Телефон', 'Доп. телефон'].some(type => type === contact.type) ? icon.classList.add(`phone-contact-icon`) : icon.classList.add(`${contact.type.toLowerCase()}-contact-icon`))
                            typeText.textContent = `${contact.type}: `
                            contact.value.includes('@') || contact.value.includes('.com') ? (tooltip.append(typeText, valueLink)) : (tooltip.append(typeText, valueText))
                            contact.type.toLowerCase().includes('телефон') ? typeText.remove() : 1
                            valueLink.textContent = contact.value
                            valueText.textContent = contact.value
                            typeText.classList.add('contact-type')
                            valueText.classList.add('contact-value')
                            valueLink.classList.add('contact-value-link')
                            tooltip.classList.add('tooltip')
                            contactBody.classList.add('contact-body')
                            contactBody.setAttribute('tabindex', '0')
                            valueLink.setAttribute('href', `http://${contact.value}`)
                            contactBody.append(tooltip, icon)
                            cellBody.append(contactBody)
                            let keydown = 0, enter, leave, timeHover
                            contactBody.addEventListener('keydown', (e) => {

                                e.key === 'Enter' || e.key === ' ' ? keydown === 0 ? (openTooltip(), keydown++) : (closeTooltip(), keydown = 0) : e.key === 'Tab' ? closeTooltip() : 1
                            })

                            contactBody.addEventListener('mouseenter', () => (openTooltip(), enter = new Date()))
                            contactBody.addEventListener('mouseleave', () => (leave = new Date(), timeHover = leave - enter, closeTooltip(timeHover)))
                        },
                        fillContactCell = () => {
                            const showMore = document.createElement('button')
                            showMore.classList.add('more-contact-icon')
                            showMore.textContent = `+${value.length - 4}`
                            value.length > 5 ? (value.slice(0, 4).map(createContactIcon), cellBody.append(showMore)) : value.map(createContactIcon)
                            showMore.addEventListener('click', () => {
                                value.length > 5 ? cellBody.firstElementChild.style.marginBottom = '7px' : 1
                                showMore.remove()
                                value.slice(4).map(createContactIcon)

                            })
                        }
                    index < 2 ? (cellBody.textContent = value, cell.append(cellBody)) : index < 4 ? value.forEach((value, index) => {
                        const text = document.createElement('span')
                        text.textContent = value
                        text.classList.add(`${key}-date-${index + 1}`)
                        cellBody.append(text)
                    }) : index == 4 ? fillContactCell() : row.doing.forEach((textBtn, index) => {
                        const btn = document.createElement('button')
                        btn.classList.add(`doing-btn-${index + 1}`)
                        btn.textContent = textBtn
                        cellBody.append(btn)
                    });
                    cellBody.classList.add(`${key}-cell-body`)
                    cell.classList.add(`${key}-column`);

                    cell.append(cellBody)
                    tableRow.append(cell);
                })
                const changeBtn = tableRow.lastElementChild.firstElementChild.firstElementChild,
                    deleteBtn = tableRow.lastElementChild.firstElementChild.lastElementChild
                changeBtn.addEventListener('click', () => (container.append(createModal(client, functionBox, 1, changeBtn)), focusModal(), changeHighModal()))
                deleteBtn.addEventListener('click', () => (container.append(createModal(client, functionBox, 2, deleteBtn)), focusModal(), changeHighModal()))

                const linkTooltip = document.createElement('div'),
                    body = document.createElement('div'),
                    link = document.createElement('input'),
                    btn = document.createElement('button'),
                    description = document.createElement('span'),
                    string = String(location).split('#')[0],
                    URL = `${string}#id${client.id}`


                linkTooltip.classList.add('link')

                body.classList.add('link-body')
                link.classList.add('link-input')
                btn.classList.add('link-btn')
                description.classList.add('link-description')

                description.textContent = 'Ссылка на карточку клиента:'
                btn.textContent = 'COPY'
                link.value = URL
                body.append(description, link, btn)
                linkTooltip.append(body)

                let timeEnter, timeLeave

                tableRow.addEventListener('mouseenter', () => {
                    timeEnter = new Date()
                    body.classList.add('openning')
                    timeoutId = setTimeout(() => body.classList.remove('openning'), 300)
                    tableRow.append(linkTooltip)
                    btn.onclick = () => {
                        link.select()
                        document.execCommand("copy");
                    }

                })
                tableRow.addEventListener('mouseleave', () => {
                    timeLeave = new Date()
                    const timeHover = timeLeave - timeEnter
                    timeHover > 300 ? (linkTooltip.style.pointerEvents = 'none', body.classList.add('closing'), timeoutID = setTimeout(() => (body.classList.remove('closing'), linkTooltip.remove(), linkTooltip.style.pointerEvents = 'auto'), 280)) : linkTooltip.remove()

                })


                tableBody.append(tableRow)
            })
            return tableBody
        },
        createList = () => {
            const container = document.createElement('div'),
                title = document.createElement('h1'),
                btn = document.createElement('button'),
                table = document.createElement('table'),
                tableHead = document.createElement('thead'),
                id = document.createElement('button'),
                name = document.createElement('button'),
                create = document.createElement('button'),
                change = document.createElement('button'),
                contacts = document.createElement('span'),
                doing = document.createElement('span'),
                array = [id, name, create, change, contacts, doing]

            title.textContent = 'Клиенты';
            btn.textContent = 'Добавить клиента';
            id.textContent = 'ID';
            name.textContent = `Фамилия Имя Отчество`;
            create.textContent = 'Дата и время \n создания';
            change.textContent = 'Последнии изменения';
            contacts.textContent = 'Контакты';
            doing.textContent = 'Действия';

            container.classList.add('container');
            container.id = 'container'
            btn.classList.add('add-btn');
            table.classList.add('table');
            table.id = 'table';
            tableHead.classList.add('table__head');
            title.classList.add('title')

            array.forEach((columnTitle, index) => {
                const cell = document.createElement('th'),
                    arrow = document.createElement('span'),
                    alphabet = document.createElement('span');
                alphabet.textContent = 'А-Я';
                columnTitle.classList.add('column-top');
                cell.classList.add('table__top-cell');
                columnTitle.id = `column-top-${index + 1}`
                arrow.classList.add('arrow');
                alphabet.classList.add('alphabet');
                index < 4 ? (columnTitle.append(arrow), index == 1 ? columnTitle.append(alphabet) : 1) : 1;
                cell.append(columnTitle);
                tableHead.append(cell);
            })
            tableHead.prepend(document.createElement('th'))
            table.append(tableHead)
            container.append(title, table, btn)

            btn.addEventListener('click', () => (container.append(createModal({}, functionBox, 0, btn), focusModal())))
            return container
        }


    document.addEventListener('DOMContentLoaded', async () => {

        const reactOnHash = (list) => {
            const clientId = location.hash.split('#').slice(-1).toString().slice(2),
                client = list.find(client => client.id === clientId)
            !!client ? (container.append(createModal(client, functionBox, 4)), focusModal(), changeHighModal()) : 1
        }

        const container = createList()
        document.body.append(container)
        const table = document.getElementById('table'),
            initialTableBody = document.createElement('tbody'),
            loading = showTableLoading(),
            header = createSearch(),
            searchValue = localStorage.getItem('searchValue'),
            idListOfClients = JSON.parse(localStorage.getItem('idListOfClients'))

        initialTableBody.classList.add('table__initial-body')
        document.body.prepend(header)
        table.append(initialTableBody)
        initialTableBody.append(loading)

        const clientsList = await getContactList(),
            clienstsListFormStorage = !!idListOfClients ? idListOfClients.reduce((array, id) => [...array, clientsList.find(client => id == client.id)], []) : [],
            tableBody = !!idListOfClients ? createTableBody(clienstsListFormStorage) : createTableBody(clientsList),
            eventInput = new Event('input'),
            search = document.querySelector('.search__input'),
            searchError = document.querySelector('.search__empty-error')
        reactOnHash(clientsList)

        search.value = !!searchValue ? searchValue : ''
        clientsList.sort((a, b) => a.id > b.id ? -1 : 1)
        initialTableBody.remove()
        table.append(tableBody)
        let timeoutID, tableList = clientsList

        search.addEventListener('input', async () => {

            searchError.textContent = ''
            clearTimeout(timeoutID)
            const inputValueArray = search.value.trim().split(' ').filter(item => item.length > 0),

                filterList = (list) => {
                    let searchWordList = [],
                        searchClientList = []
                    list.forEach(client => {
                        const values = Object.values(client).slice(0, 2).reduce((array, item) => [...array, item], [])
                        searchWordList.some(item => item.join('').toLowerCase() === values.join('').toLowerCase()) ? 1 : searchWordList.push(values)
                        searchWordList.sort((a, b) => `${a.join('').toLowerCase()}` < `${b.join('').toLowerCase()}` ? -1 : 1)
                        inputValueArray.every(word => values.some(item => item.toLowerCase().includes(`${word.toLowerCase()}`))) ? searchClientList.push(client) : 1
                    })

                    return { words: searchWordList, clients: searchClientList };
                },
                clientsListData = filterList(clientsList),
                searchClientList = clientsListData.clients,
                listDataForSearch = filterList(searchClientList),
                adviceList = document.querySelector('.search__advice-list'),
                adviceListBody = document.createElement('div'),
                showClients = () => inputValueArray.length > 0 ? (table.append(createTableBody(searchClientList)), tableList = searchClientList) : (table.append(createTableBody(clientsList)), tableList = clientsList)

            !!adviceList.firstElementChild ? adviceList.firstElementChild.remove() : 1
            adviceListBody.classList.add('advice-list__body')
            !adviceList.classList.value.includes('searching') ? adviceList.classList.add('searching') : 1
            inputValueArray.length > 0 ? listDataForSearch.words.forEach(advice => {
                const adviceElement = document.createElement('button')
                adviceElement.textContent = advice.join(' ')
                adviceElement.classList.add('advice-list__item')
                adviceElement.addEventListener('click', () => (search.value = adviceElement.textContent, adviceList.firstElementChild.remove(), search.dispatchEvent(eventInput), adviceList.classList.toggle('searching'), search.focus()))
                adviceListBody.children.length < 10 ? adviceListBody.append(adviceElement) : 1
            }) : 1
            adviceList.append(adviceListBody)
            table.lastElementChild.append(loading)
            timeoutID = setTimeout(() => (!!table.lastElementChild && table.children.length > 1 ? table.lastElementChild.remove() : 1, loading.remove(), showClients()), 300)
            document.querySelectorAll('.advice-list__item').forEach(btn => {
                let currentClient;
                btn.addEventListener('focusin', () => {
                    tableList.forEach((client, index) => btn.textContent === [client.name, client.surname].join(' ') ? currentClient = document.querySelector('.table__body').children[index] : 1)
                    currentClient.classList.add('wanted-client')
                    currentClient.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    btn.addEventListener('keydown', (event) => {
                        event.preventDefault()
                        event.key === 'Enter' ? (search.value = btn.textContent, search.dispatchEvent(eventInput), adviceList.classList.toggle('searching'), search.focus()) : 1
                        !!btn.nextElementSibling && event.key === 'ArrowDown' ? btn.nextElementSibling.focus() : 1
                        !!btn.previousElementSibling && event.key === 'ArrowUp' ? btn.previousElementSibling.focus() : !btn.previousElementSibling && event.key === 'ArrowUp' ? search.focus() : 1

                    })
                })
                btn.addEventListener('focusout', () => {
                    currentClient.classList.remove('wanted-client')
                })

            })

            searchClientList.length == 0 ? searchError.textContent = 'Ничего не найдено' : 1
            localStorage.setItem('searchValue', `${inputValueArray.join(' ')}`)
        })




        const id = { element: document.getElementById('column-top-1'), listKey: 'id' },
            name = { element: document.getElementById('column-top-2'), listKey: ['surname', 'name', 'lastName'] },
            create = { element: document.getElementById('column-top-3'), listKey: 'createdAt' },
            change = { element: document.getElementById('column-top-4'), listKey: 'updatedAt' },
            tableBtnArray = [id, name, create, change],
            sortColumn = (btn, index) => (btn.clickOnBtn = index === 0 ? 1 : 0, btn.element.addEventListener('click', () => {
                !!table.lastElementChild && table.children.length > 1 ? table.lastElementChild.remove() : 1

                const isClickedTwice = btn.clickOnBtn % 2 === 0 ? true : false,
                    getSortDirection = (a, b) => isClickedTwice ? a < b ? -1 : 1 : a > b ? -1 : 1

                index === 0 ? tableList.sort((a, b) => getSortDirection(a[`${btn.listKey}`], b[`${btn.listKey}`])) : index === 1 ? tableList.sort((a, b) => getSortDirection(Object.entries(a).filter(item => btn.listKey.some(key => key === item[0])).reduce((array, item) => [...array, item[1]], []).join(''), Object.entries(b).filter(item => btn.listKey.some(key => key === item[0])).reduce((array, item) => [...array, item[1]], []).join(''))) : tableList.sort((a, b) => getSortDirection(new Date(a[`${btn.listKey}`]), new Date(b[`${btn.listKey}`])))

                table.append(createTableBody(tableList))
                tableBtnArray.filter((item, i) => i !== index).forEach(item => item.clickOnBtn = 0)
                btn.clickOnBtn++
                isClickedTwice ? btn.element.querySelector('.arrow').classList.remove('arrow-down') : btn.element.querySelector('.arrow').classList.add('arrow-down')
                if (index === 1) {
                    isClickedTwice ? btn.element.querySelector('.alphabet').textContent = 'А-Я' : btn.element.querySelector('.alphabet').textContent = 'Я-А'
                }
            }))

        tableBtnArray.map(sortColumn)
        let click = 0;
        search.addEventListener('click', () => (document.querySelector('.search__advice-list').classList.toggle('searching'), click++))
        search.addEventListener('keydown', (e) => e.key === 'ArrowDown' ? (e.preventDefault(), document.querySelector('.advice-list__item').focus()) : 1)
        document.body.addEventListener('click', () => {
            click == 0 && document.querySelector('.search__advice-list').classList.value.includes('searching') ? document.querySelector('.search__advice-list').classList.toggle('searching') : 1

            click = 0
        })

        window.addEventListener('hashchange', () => {
            reactOnHash(clientsList)
        })

    })



})()