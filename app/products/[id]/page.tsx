import { getProductById } from '@/lib/actions';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Product } from '@/types';
import Link from 'next/link';
import { formatNumber } from '@/lib/utils';

interface Props{
  params: { id: string }
}

const ProductDetails = async ({ params: { id } }: Props) => {
  const product: Product = await getProductById(id);

  if (!product) redirect('/');

  return (
    <div className='product-container'>
      <div className='flex gap-28 xl:flex-row flex-col'>
        <div className='product-image'>
          <Image
              src={product.image}
              alt={product.title}
              height={440}
              width={570}
              className='mx-auto'
          />
        </div>

        <div className='flex-1 flex flex-col'>
          <div className='flex justify-between items-start gap-5 flex-wrap pb-6'>
            <div className='flex flex-col gap-3'>
              <p className='text-black text-[30px]'>{product.title}</p>
              <Link href={product.url} target='_blank' className='text-base text-black opacity-50'>
                Visit Product
              </Link>
            </div>

            <div className='flex items-center gap-3'>
              <div className='product-hearts'>
                <Image
                  src="/assets/icons/red-heart.svg"
                  alt="icons"
                  width={20}
                  height={20}
                />

                <p className='text-base font-semibold text-[#D46F77]'>
                  {product.reviewsCount}
                </p>
              </div>

              <div className='p-2 bg-white-200 rounded-10'>
                <Image
                  src="/assets/icons/bookmark.svg"
                  alt="icons"
                  width={20}
                  height={20}
                />
              </div>
              <div className='p-2 bg-white-200 rounded-10'>
                <Link href='/'>
                  <Image
                    src="/assets/icons/share.svg"
                    alt="icons"
                    width={20}
                    height={20}
                   
                  />
                </Link>
              </div>
              <div className='product-info'>
                <div className='flex flex-col gap-2'>
                  <p className='text-[30px] text-blue-400 font-bold'>
                    {product.currency}{formatNumber(product.currentPrice)}
                  </p>
                  <p className='text-[20px] text-red-500 opacoty-50 line-through'>
                    {product.currency}{formatNumber(product.currentPrice)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails;
