

describe('Our first suite will visit our webpage navigate to the form layouts and count the number of elements that fit the selectors outlined in the test.', () => {

    it('first test', () => {
        
        cy.visit('/')

        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()
        
        //using email input field as an example
        //by Tag Name
        cy.get('input')

        //by ID
        cy.get('#inputEmail1')

        //by Class name
        cy.get('.input-full-width')

        //by Atribute name
        cy.get('[placeholder]')

        // by attribute name and value
        cy.get('[placeholder="Email"]')

        //by class value
        cy.get('[class="input-full-width size-medium shape-rectangle"]')

        //by tagname and attribute with value
        cy.get('input[placeholder="Email"]')

        //find by two different attributes
        cy.get('[placeholder="Email"][fullwidth]')

        //find element by tag name, attribute with value and class name
        cy.get('input[placeholder="Email"]#inputEmail1.input-full-width')

        //The most recommended way by Cypress
        cy.get('[data-cy="imputEmail1"]')

    })
})