describe('our second test suite', () => {
    it('second test', () => {

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        //grid sign in
        cy.get('[data-cy="gridSignInButton"]')
        cy.contains('Sign in')

        //yellow sign in
        cy.contains('[status="warning"]', 'Sign in')

        //navigate around the element
        cy.get('#inputEmail3')
            .parents('form')
            .find('button')
            .should('contain', 'Sign in')
            .parents('form')
            .find('nb-checkbox')
            .click()

        cy.contains('nb-card', 'Horizontal form').find('[type="email"]')
    })

    it('then and wrap methods', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        cy.contains('nb-card', 'Using the Grid').find('[for="inputEmail1"]').should('contain', 'Email')
        cy.contains('nb-card', 'Using the Grid').find('[for="inputPassword2"]').should('contain', 'Password')

        cy.contains('nb-card', 'Basic form').find('[for="exampleInputEmail1"]').should('contain', 'Email')
        cy.contains('nb-card', 'Basic form').find('[for="exampleInputPassword1"]').should('contain', 'Password')

        //lots of duplicated code above, need to use THEN function to minimise dulpication
        cy.contains('nb-card', 'Using the Grid').then(firstForm => {
            // jquery here, cypress is not known, e.g find here is from jquery and not cypress
            const emailLabelFirst = firstForm.find('[for="inputEmail1"]').text()
            const passwordLabelFirst = firstForm.find('[for="inputPassword2"]').text()

            expect(emailLabelFirst).to.equal('Email')
            expect(passwordLabelFirst).to.equal('Password')

            // you can nest functions to be able to share variables betwwen the functions
            cy.contains('nb-card', 'Basic form').then(secondForm => {
                const emailSecondForm = secondForm.find('[for="exampleInputEmail1"]').text()
                const passwordSecondForm = secondForm.find('[for="exampleInputPassword1"]').text()

                expect(passwordLabelFirst).to.equal(passwordSecondForm)

                //you can use the wrap function to allow you to run cypress commands on the jquery object.
                cy.wrap(secondForm).find('[for="exampleInputPassword1"]').should('contain', 'Password')
            })
        })
    })
    it('invoke command', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        cy.get('[for="exampleInputEmail1"]').invoke('text').then(text => {
            expect(text).to.equal('Email address')
        })

        cy.contains('nb-card', 'Basic form')
            .find('nb-checkbox')
            .click()
            .find('.custom-checkbox')
            .invoke('attr', 'class')
            //.should('contain', 'checked')
            .then(classValue => {
                expect(classValue).to.contain('checked')
            })

    })

    it('assert property on date picker', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Datepicker').click()

        cy.contains('nb-card', 'Common Datepicker')
            .find('input').then(input => {
                cy.wrap(input).click()
                cy.get('nb-calendar-day-picker')
                    .contains('17')
                    .click()

                cy.wrap(input).invoke('prop', 'value').should('contain', 'Mar 17, 2021')
            })
    })

    it('radio button tests', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()


        cy.contains('nb-card', 'Using the Grid').find('[type="radio"]').then(radioButtons => {
            cy.wrap(radioButtons)
                .first()
                // force true overrides the fact the radio was not visible
                .check({ force: true })
                .should('be.checked')

            cy.wrap(radioButtons)
                .eq(1)
                .check({ force: true })

            cy.wrap(radioButtons)
                .first()
                // force true overrides the fact the radio was not visible
                .check({ force: true })
                .should('not.be.checked')

            cy.wrap(radioButtons)
                .eq(2)
                .should('be.disabled')
        })
    })

    it('check boxes', () => {
        cy.visit('/')
        cy.contains('Modal & Overlays').click()
        cy.contains('Toastr').click()

        // cy.get('[type="checkbox"]').check({force: true})

        cy.get('[type="checkbox"]').eq(0).click({ force: true });
        //check does not uncheck!
        cy.get('[type="checkbox"]').eq(1).check({ force: true });
    })

    it('lists and drop down elements', () => {
        cy.visit('/')
        //select the list
        cy.get('nav nb-select').click()
        //check list contains an item and can be selected
        cy.get('.options-list').contains('Dark').click()
        cy.get('nav nb-select').should('contain', 'Dark')
        //colours cypress works with RBG format and not hex
        cy.get('nb-layout-header nav').should('have.css', 'background-color', 'rgb(34, 43, 69)')

        //loop through and assert all options
        cy.get('nav nb-select').then(dropdown => {
            cy.wrap(dropdown).click()

            //get all options from list using for each loop
            cy.get('.options-list nb-option').each((listItem, index) => {
                const itemText = listItem.text().trim()

                // create list of colors for assertion later
                const colors = {
                    "Light": "rgb(255, 255, 255)",
                    "Dark": "rgb(34, 43, 69)",
                    "Cosmic": "rgb(50, 50, 89)",
                    "Corporate": "rgb(255, 255, 255)"
                }
                //click on the listitem
                cy.wrap(listItem).click()
                //assert the list contains
                cy.wrap(dropdown).should('contain', itemText)
                // assert page changes color, using the key of the item name in the color list we created
                cy.get('nb-layout-header nav').should('have.css', 'background-color', colors[itemText])

                //set an index earlier so we can skip the final drop down click at the end of the test as it is not required.
                if (index < 3) {
                    cy.wrap(dropdown).click()
                }
            })
        })

    })

    it('Web tables', () => {
        cy.visit('/')
        cy.contains('Tables & Data').click()
        cy.contains('Smart Table').click()

        // 1 edit a table item
        cy.get('tbody').contains('tr', 'Larry').then(tableRow => {
            cy.wrap(tableRow).find('.nb-edit').click()
            cy.wrap(tableRow).find('[placeholder="Age"]').clear().type('25')
            cy.wrap(tableRow).find('.nb-checkmark').click()

            cy.wrap(tableRow).find('td').eq(6).should('contain', '25')
        })

        //2 add a row to table
        cy.get('thead').find('.nb-plus').click()
        cy.get('thead').find('tr').eq(2).then(tableRow => {
            cy.wrap(tableRow).find('[placeholder="First Name"]').type('Artem')
            cy.wrap(tableRow).find('[placeholder="Last Name"]').type('Jones')
            cy.wrap(tableRow).find('.nb-checkmark').click()
        })
        cy.get('tbody tr').first().find('td').then(tableColumns => {
            cy.wrap(tableColumns).eq(2).should('contain', 'Artem')
            cy.wrap(tableColumns).eq(3).should('contain', 'Jones')
        })

        //3 filter the age column, iterate through an array of ages and check all results returned are relevant to the filter.
        const age = [20, 30, 40, 200]

        cy.wrap(age).each(age => {
            cy.get('thead [placeholder="Age"').clear().type(age)
            cy.wait(500)
            cy.get('tbody tr').each(tableRow => {
                if (age == 200) {
                    cy.wrap(tableRow).should('contain', 'No data found')
                } else {
                    cy.wrap(tableRow).find('td').eq(6).should('contain', age)
                }
            })
        })


    })

    function selectDayFromCurrent(day) {
        let date = new Date()
        date.setDate(date.getDate() + day)
        let futureDay = date.getDate()
        let futureMonth = date.toLocaleString('default', { month: "short" })
        let dateAssert = futureMonth + ' ' + futureDay + ', ' + date.getFullYear()
        cy.get('nb-calendar-navigation').invoke('attr', 'ng-reflect-date').then(dateAttribute => {
            if (!dateAttribute.includes(futureMonth)) {
                cy.get('[data-name="chevron-right"]').click()
                selectDayFromCurrent(day)
            } else {
                cy.get('nb-calendar-day-picker [class="day-cell ng-star-inserted"]')
                    .contains(futureDay)
                    .click()
            }
        })
        return dateAssert;
    }

    it.only('Date picker not hardcoded', () => {

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Datepicker').click()



        cy.contains('nb-card', 'Common Datepicker').find('input').then(input => {
            cy.wrap(input).click()
            const dateAssert = selectDayFromCurrent(2)
            cy.wrap(input).invoke('prop', 'value').should('contain', dateAssert)
        })
    })

})