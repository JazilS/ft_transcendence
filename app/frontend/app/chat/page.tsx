import React from 'react';
import MyHeader from '@/components/Header';
import '../styles.css';
import Button from '@/components/Button';
import { Variable } from 'lucide-react';
import { db } from '@/lib/db'

export default async function HomePage() {

	await db.set('hello', 'hello')

	return (
		<div className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-[100vh]">
			<MyHeader /> 
			<Button variant='default' size='default' isLoading={false} disabled={false} >Button</ Button>
		</div>
	);
}
