package com.talker.talker.domain;

public class Views {

    public static class SuperShortPost {}

    public static class ShortPost extends SuperShortPost {}

    public static class SuperShortResponse extends SuperShortPost {}

    public static class ShortResponse extends SuperShortResponse {}

    public static class ShortNotification extends SuperShortResponse {}

}
