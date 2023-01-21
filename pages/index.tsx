import mainImage from '@/assets/images/main_image.jpg';
import styles from '@/styles/Home.module.css';
import Head from 'next/head';
import Image from 'next/image';
import { FormEvent, useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';

export default function Home() {

  const [quote, setQuote] = useState("");
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteLoadingError, setQuoteLoadingError] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const prompt = formData.get("prompt")?.toString().trim();

    if (prompt) {
      try {
        setQuote("");
        setQuoteLoadingError(false);
        setQuoteLoading(true);

        const response = await fetch("/api/cringe?prompt=" + encodeURIComponent(prompt));
        const body = await response.json();
        setQuote(body.quote);
      } catch (error) {
        console.error(error);
        setQuoteLoadingError(true);
      } finally {
        setQuoteLoading(false);
      }
    }
  }

  return (
    <>
      <Head>
        <title>Cringe AI - Create cringy motivational quotes</title>
        <meta name="description" content="By Tarek" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>Cringe AI</h1>
        <h2>powered by GPT-3</h2>
        <div>Enter a topic and the AI will generate a super cringy motivational quote</div>
        <div className={styles.mainImageContainer}>
          <Image
            src={mainImage}
            fill
            alt='A woman covering her face with her hands'
            priority
            className={styles.mainImage}
          />
        </div>
        <Form onSubmit={handleSubmit} className={styles.inputForm}>
          <Form.Group className='mb-3' controlId='prompt-input'>
            <Form.Label>Create a cringy note about... </Form.Label>
            <Form.Control
              name='prompt'
              placeholder='e.g. success, fear, potatoes'
              maxLength={100}
            />
          </Form.Group>
          <Button type='submit' className='mb-3' disabled={quoteLoading}>
            Make me cringe
          </Button>
        </Form>
        {quoteLoading && <Spinner animation='border' />}
        {quoteLoadingError && "Something went wrong. Please try again."}
        {quote && <h5>{quote}</h5>}
      </main>
    </>
  )
}
