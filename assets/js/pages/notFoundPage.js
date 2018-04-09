import React from 'react';
import { Container, NotFound } from 'app/components';
import { Link } from 'react-router-dom';


const NotFoundPage = () => (
  <Container>
    <NotFound title="Nothing to see here!" faClassName="fa fa-5x fa-frown-o">
      Click <Link to="/">here</Link> to return to the main page.
    </NotFound>
  </Container>
);


export default NotFoundPage;
