import '@testing-library/jest-dom'; // Provides Jest DOM matchers
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App'; // Import App component
import nock from 'nock'; // Import nock for HTTP request mocking

describe('App Component Tests with Nock', () => {
  // Clean up nock after each test to avoid side effects
  afterEach(() => {
    nock.cleanAll();
  });

  it('should render resulting data in the output area after form submission', async () => {
    const mockUrl = 'https://pokeapi.co/api/v2/pokemon/ditto'; // URL to be mocked

    const mockResponse = {
      id: 132,
      name: 'ditto',
      abilities: [
        {
          ability: { name: 'limber' },
          is_hidden: false,
        },
        {
          ability: { name: 'imposter' },
          is_hidden: true,
        },
      ],
      base_experience: 101,
      height: 3,
      weight: 40,
    };

    // Use nock to mock the HTTP request to the given URL
    nock('https://pokeapi.co') // Base URL for nock to intercept
      .get('/api/v2/pokemon/ditto') // Define the endpoint to mock
      .reply(200, mockResponse); // Return the mock response with status 200

    // Render the App component for testing
    render(<App />);

    // Find the input field and submit button in the rendered component
    const input = screen.getByLabelText(/url/i); // Find the URL input field
    const submitButton = screen.getByText(/go!/i); // Find the submit button

    // Simulate form submission with the mocked URL
    fireEvent.change(input, { target: { value: mockUrl } }); // Change the input value to the mocked URL
    fireEvent.click(submitButton); // Simulate a click on the submit button

    // Wait for the expected data to be rendered
    await waitFor(() => {
      // Check for specific content from the mock response
      expect(screen.getByText(/ditto/i)).toBeInTheDocument(); // Check if "ditto" is rendered
      expect(screen.getByText(/limber/i)).toBeInTheDocument(); // Check if "limber" ability is rendered
      expect(screen.getByText(/imposter/i)).toBeInTheDocument(); // Check if "imposter" ability is rendered
    });
  });
});
