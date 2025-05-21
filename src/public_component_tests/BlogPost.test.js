import { render, screen } from '@testing-library/react';
import BlogPost from '../../src/pages/blog/BlogPost';

test('renders individual blog post', () => {
  render(<BlogPost />);
  expect(screen.getByTestId('blog-post')).toBeInTheDocument();
});
