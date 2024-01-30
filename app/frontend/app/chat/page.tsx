import React from 'react';
import MyHeader from '@/components/Header';
import '../styles.css';

export default function HomePage() {
	return (
		<div className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-[100vh]">
			<MyHeader /> 
		</div>
  );
}
