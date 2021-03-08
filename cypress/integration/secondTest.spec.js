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

    it.only('assert property on date picker', () => {
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
})