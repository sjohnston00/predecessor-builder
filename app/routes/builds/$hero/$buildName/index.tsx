import React from "react";
import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { prisma } from "~/utils/prisma.server";
import Textarea from "~/components/Textarea";
import Button from "~/components/Button";
import Heading from "~/components/Heading";
import LinkButton from "~/components/LinkButton";
import Container from "~/components/Container";
import { getAuth } from "@clerk/remix/ssr.server";
import type { User } from "@clerk/remix/dist/api/index";
import type { Item } from "~/types/items.server";
import clerkClient from "~/utils/clerk.server";
import { getItemsByNameArray } from "~/utils/items.server";
import ItemButton from "~/components/ItemButton";

export const loader = async (args: LoaderArgs) => {
  const { params } = args;
  const buildName = params.buildName;
  const hero = params.hero;
  const { userId } = await getAuth(args);

  if (!buildName) throw redirect("/builds/");

  const build = await prisma.build.findFirst({
    where: {
      name: {
        equals: buildName,
        mode: "insensitive"
      }
    },
    include: {
      hero: true,
      comments: true,
      likes: true
    }
  });

  if (!build)
    throw new Response(`Couldn't find a build under the name ${buildName}`, {
      status: 404
    });

  const allUsers = await clerkClient.users.getUserList();
  let buildUser: User | null | undefined;

  if (build.userId) {
    buildUser = allUsers.find((user) => user.id === build.userId);
  }

  const buildComments = build.comments.map((comment) => {
    const user = allUsers.find((user) => user.id === comment.userId);

    return {
      ...comment,
      user
    };
  });

  let buildItems: Item[] | undefined;

  if (build.items) {
    buildItems = getItemsByNameArray(build.items);
  }

  const loggedInUserHasBuildLike = await prisma.like.findFirst({
    where: {
      userId: userId || "",
      buildId: build.buildId
    }
  });

  //NOTE: Builds can be anonymous so if the users is not logged in then, build.userId will equal loggedInUserId for every anonymours user
  //So we check whether the user is even loggedinfirst and then check whether they are the same
  const isLoggedInUsersBuild = !!userId && build.userId === userId;

  return {
    loggedInUserHasBuildLike,
    isLoggedInUsersBuild,
    build: {
      ...build,
      user: buildUser,
      items: buildItems,
      comments: buildComments
    },
    hero,
    isUserLoggedIn: !!userId
  };
};

export const action = async (args: ActionArgs) => {
  const { request, params } = args;
  const formData = await request.formData();
  const buildName = params.buildName as string;
  const data = Object.fromEntries(formData);
  const { userId } = await getAuth(args);

  if (!userId) return null;

  if (data._action === "like") {
    const loggedInUserHasBuildLike = await prisma.like.findFirst({
      where: {
        AND: [
          {
            build: {
              name: {
                equals: buildName,
                mode: "insensitive"
              }
            }
          },
          { userId: userId }
        ]
      }
    });
    //If we already like it, remove the like
    if (loggedInUserHasBuildLike) {
      await prisma.like.delete({
        where: {
          likeId: loggedInUserHasBuildLike.likeId
        }
      });
      return null;
    }
    //Else we haven't liked it, create a like
    await prisma.like.create({
      data: {
        userId: userId,
        buildId: data.buildId.toString()
      }
    });
    return null;
  }

  if (data._action === "comment") {
    await prisma.comment.create({
      data: {
        userId: userId,
        buildId: data.buildId.toString(),
        content: data.comment.toString()
      }
    });
    return null;
  }

  return data;
};

export default function BuildNumber() {
  const {
    build,
    isLoggedInUsersBuild,
    loggedInUserHasBuildLike,
    hero,
    isUserLoggedIn
  } = useLoaderData<typeof loader>();
  const { state } = useTransition();
  const isSubmitting = state === "submitting";
  return (
    <Container>
      <Heading>{build.name}</Heading>
      <div className='flex gap-2'>
        <LinkButton to={"/builds"}>All Builds</LinkButton>
        <LinkButton to={`/builds/${hero}`} className='bg-blue-500'>
          {hero} Builds
        </LinkButton>
      </div>
      <p>Hero: {build.hero.name}</p>
      <p>
        By: {build.user?.username ? `${build.user?.username}` : "Anonymous"}
      </p>
      <Heading type='h2'>Items</Heading>
      <div className='grid grid-cols-6 gap-2 self-stretch min-h-[139px]'>
        {build.items?.map((item) => (
          <ItemButton
            item={item}
            imageHeight={75}
            imageWidth={75}
            key={`${item.name}`}
            className='bg-transparent'
          />
        ))}
      </div>
      <Heading type='h2'>
        Comments <sup className='text-gray-400'>{build.comments.length}</sup>
      </Heading>
      {build.comments.map((comment) => (
        <p className='mb-4 flex justify-between' key={comment.commentId}>
          {comment.content}{" "}
          <span className='text-gray-400'>
            {comment.user?.username || "Anonymous"}
          </span>
        </p>
      ))}

      <Heading type='h2'>Skill Order</Heading>
      <p className='mb-4'>[{build.abilityOrder.toLocaleString()}]</p>
      {isLoggedInUsersBuild ? (
        <LinkButton to={`/builds/${build.hero.name}/${build.name}/edit`}>
          Edit
        </LinkButton>
      ) : null}
      <Form method='post'>
        <input type='hidden' name='_action' id='_action' value='like' />
        <input
          type='hidden'
          name='loggedInUserHasBuildLike'
          id='loggedInUserHasBuildLike'
          value={loggedInUserHasBuildLike?.likeId}
        />
        <input
          type='hidden'
          name='buildId'
          id='buildId'
          value={build.buildId}
        />
        <Button
          type='submit'
          disabled={isSubmitting}
          className='bg-transparent text-black inline-flex gap-1 items-center'>
          {loggedInUserHasBuildLike ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6 text-indigo-500'>
              <path d='M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z' />
            </svg>
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-6 h-6 text-indigo-500'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z'
              />
            </svg>
          )}
          <small className='text-indigo-300'>{build.likes.length}</small>
        </Button>
      </Form>
      <Form method='post'>
        <input type='hidden' name='_action' id='_action' value='comment' />
        <input
          type='hidden'
          name='buildId'
          id='buildId'
          value={build.buildId}
        />
        <Textarea
          disabled={!isUserLoggedIn}
          name='comment'
          id='comment'
          required
        />
        <Button type='submit' disabled={isSubmitting || !isUserLoggedIn}>
          Comment
        </Button>
      </Form>
    </Container>
  );
}
