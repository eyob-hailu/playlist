/** @jsxImportSource @emotion/react */
import { Global, css } from '@emotion/react';

const GlobalStyles = () => (
  <Global
    styles={css`
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;800&family=VT323&display=swap');

      :root {
        --primary: #1aac83;
        --error: #e7195a;
      }
      body {
        background: #f1f1f1;
        margin: 0;
        font-family: 'Poppins', sans-serif;
      }
      header {
        background: #fff;
      }
      header .container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 10px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      header a {
        color: #333;
        text-decoration: none;
      }
      .pages {
        max-width: 1400px;
        padding: 20px;
        margin: 0 auto;
      }
    `}
  />
);

export default GlobalStyles;
